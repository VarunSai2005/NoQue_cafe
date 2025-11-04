  window.initMenuPage = function(){
    ensureSeeded();
    const user = getUser();
    if(!user){
      alert('Please login to access the menu.');
      window.location.href = 'login.html';
      return;
    }
    renderAuthUI();
    const search = document.getElementById('search');
    renderMenu(search.value || '');
    search.addEventListener('input', ()=> renderMenu(search.value || ''));
  };

  window.initCartPage = function(){
    const user = getUser();
    if(!user){
      alert('Please login to view your cart.');
      window.location.href = 'login.html';
      return;
    }
    renderAuthUI();
    renderCart();
    document.getElementById('place-order').addEventListener('click', placeOrder);
    document.getElementById('clear-cart').addEventListener('click', ()=>{
      localStorage.removeItem(STORAGE.CART);
      renderCart();
    });
    document.getElementById('close-popup').addEventListener('click', ()=>{
      document.getElementById('order-popup').style.display='none';
    });
    document.getElementById('copy-token').addEventListener('click', async ()=>{
      const t = document.getElementById('order-token').textContent;
      try{ 
        await navigator.clipboard.writeText(t);
        showToast('Copied token');
      }catch(e){ alert('Copy failed'); }
    });
  };

  window.initAdminPage = function(){
    const cur = getUser();
    if(!cur){
      alert('Please login as admin to continue.');
      window.location.href = 'login.html';
      return;
    }
    if(cur.role !== 'admin'){
      alert('Admin access required.');
      window.location.href = 'index.html';
      return;
    }
    renderAuthUI();
    renderAdminList();
    document.getElementById('add-item').addEventListener('click', ()=>{
      document.getElementById('item-form').style.display = 'block';
      document.getElementById('form-title').textContent = 'New Item';
      document.getElementById('item-name').value='';
      document.getElementById('item-desc').value='';
      document.getElementById('item-price').value='';
      document.getElementById('item-tags').value='';
      window._editingId = null;
    });
    document.getElementById('cancel-item').addEventListener('click', ()=>{
      document.getElementById('item-form').style.display = 'none';
    });
    document.getElementById('save-item').addEventListener('click', ()=>{
      const name = document.getElementById('item-name').value.trim();
      const desc = document.getElementById('item-desc').value.trim();
      const price = Number(document.getElementById('item-price').value) || 0;
      const tags = document.getElementById('item-tags').value.split(',').map(t=>t.trim()).filter(Boolean);
      if(!name) return alert('Name required');
      const menu = loadMenu();
      if(window._editingId){
        const next = menu.map(m => m.id === window._editingId ? Object.assign({}, m, {name, desc, price, tags}) : m);
        saveMenu(next);
      } else {
        const id = 'm' + Math.floor(Math.random()*1000000);
        menu.push({id, name, desc, price, tags});
        saveMenu(menu);
      }
      document.getElementById('item-form').style.display = 'none';
      renderAdminList();
      showToast('Menu updated');
    });
  };
