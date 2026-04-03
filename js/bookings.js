const Bookings = {
  getAll() {
    const username = Auth.getSession();
    if (!username) return [];
    const users = Auth.getUsers();
    return (users[username] && users[username].bookings) ? users[username].bookings : [];
  },
  add(plan) {
    const username = Auth.getSession();
    if (!username) return false;
    const users = Auth.getUsers();
    if (!users[username].bookings) users[username].bookings = [];
    users[username].bookings.push({
      id: Date.now(),
      name: plan.name,
      price: plan.price,
      destination: plan.destination,
      duration: plan.duration,
      type: plan.type,
      bookedAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    });
    Auth.saveUsers(users);
    return true;
  },
  cancel(bookingId) {
    const username = Auth.getSession();
    if (!username) return false;
    const users = Auth.getUsers();
    users[username].bookings = users[username].bookings.filter(b => b.id !== bookingId);
    Auth.saveUsers(users);
    return true;
  }
};

function bookPlan(plan) {
  if (!Auth.isLoggedIn()) {
    const redirect = encodeURIComponent(window.location.href);
    window.location.href = 'auth.html?redirect=' + redirect;
    return;
  }
  Bookings.add(plan);
  showToast('Journey booked — see you there.');
}

function showToast(message) {
  const existing = document.querySelector('.wander-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'wander-toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 450);
  }, 3400);
}
