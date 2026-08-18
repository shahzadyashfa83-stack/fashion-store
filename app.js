
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const CART_KEY="neena_wear_cart";
let cart=JSON.parse(localStorage.getItem(CART_KEY)||"[]");
let activeProduct=null;
function money(n){return "Rs. "+n.toLocaleString("en-PK")}
function saveCart(){localStorage.setItem(CART_KEY,JSON.stringify(cart));renderCart()}
function renderCart(){
 const count=cart.reduce((a,p)=>a+p.qty,0); const cc=$("#cartCount"); if(cc)cc.textContent=count;
 const box=$("#cartItems"); if(!box)return;
 if(!cart.length){box.innerHTML='<p style="color:var(--muted);padding:30px 0">Your cart is waiting for something beautiful.</p>'}
 else box.innerHTML=cart.map(p=>`<div class="cart-row"><img src="${p.img}" alt=""><div><strong>${p.name}</strong><small>${money(p.price)} × ${p.qty}</small><button class="remove" onclick="removeCart(${p.id})">Remove</button></div><b>${money(p.price*p.qty)}</b></div>`).join("");
 const total=cart.reduce((a,p)=>a+p.price*p.qty,0); const t=$("#cartTotal"); if(t)t.textContent=money(total);
}
function addCart(id){const p=PRODUCTS.find(x=>x.id==id);if(!p)return;const old=cart.find(x=>x.id==id);old?old.qty++:cart.push({...p,qty:1});saveCart();showToast("Added to cart")}
function removeCart(id){cart=cart.filter(p=>p.id!=id);saveCart()}
function showToast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1800)}
function openCart(){ $("#drawer")?.classList.add("open");$("#overlay")?.classList.add("open");}
function closeCart(){ $("#drawer")?.classList.remove("open");$("#overlay")?.classList.remove("open");}
function openProduct(id){const p=PRODUCTS.find(x=>x.id==id);if(!p)return;activeProduct=p;$("#modalImg").src=p.img;$("#modalImg").alt=p.name;$("#modalName").textContent=p.name;$("#modalPrice").textContent=money(p.price);$("#modalDesc").textContent=p.desc;$("#modalBadge").textContent=p.badge||p.category;$("#productModal").classList.add("open")}
function closeProduct(){$("#productModal")?.classList.remove("open")}
function card(p){return `<article class="product" data-tilt data-id="${p.id}"><div class="media"><img src="${p.img}" alt="${p.name}" loading="lazy">${p.badge?`<span class="badge">${p.badge}</span>`:""}</div><div class="info"><h3>${p.name}</h3><div class="meta"><span>${p.category}</span><span class="price">${money(p.price)}</span></div></div><button class="quick" onclick="openProduct(${p.id})" aria-label="View ${p.name}">↗</button></article>`}
const finePointerQuery=window.matchMedia("(hover: hover) and (pointer: fine)");
function initCardTilt(){
 if(!window.VanillaTilt)return;
 if(!finePointerQuery.matches){
  $$("[data-tilt]").forEach(el=>el.vanillaTilt?.destroy());
  return;
 }
 $$("[data-tilt]").forEach(el=>{
  if(!el.vanillaTilt)VanillaTilt.init(el,{max:7,speed:500,glare:true,"max-glare":.12});
 });
}
function renderGrid(target,list){
 const el=$(target);if(!el)return;
 el.innerHTML=list.map(card).join("");
 initCardTilt();
}
function setupFilters(){
 const grid=$("#catalogGrid"), filters=$$(".filter"); if(!grid)return;
 let current="All";
 const update=()=>renderGrid("#catalogGrid",current==="All"?PRODUCTS:PRODUCTS.filter(p=>p.category===current));
 filters.forEach(f=>f.addEventListener("click",()=>{filters.forEach(x=>x.classList.remove("active"));f.classList.add("active");current=f.dataset.filter;update()}));update();
}
document.addEventListener("DOMContentLoaded",()=>{
 const page=document.body.dataset.page; const link=$(`[data-page="${page}"]`);link?.classList.add("active");
 $("#cartBtn")?.addEventListener("click",openCart);$("#closeCart")?.addEventListener("click",closeCart);$("#overlay")?.addEventListener("click",closeCart);
 $("#closeModal")?.addEventListener("click",closeProduct);$("#productModal")?.addEventListener("click",e=>{if(e.target.id==="productModal")closeProduct()});
 $("#modalAdd")?.addEventListener("click",()=>{if(activeProduct){addCart(activeProduct.id);closeProduct();}});
 $("#menuBtn")?.addEventListener("click",()=>{
  const nav=$("#navInner");
  const isOpen=nav?.classList.toggle("mobile");
  $("#menuBtn")?.setAttribute("aria-expanded",String(!!isOpen));
 });
 $$("#links a").forEach(link=>link.addEventListener("click",()=>{
  $("#navInner")?.classList.remove("mobile");
  $("#menuBtn")?.setAttribute("aria-expanded","false");
 }));
 if(finePointerQuery.addEventListener)finePointerQuery.addEventListener("change",initCardTilt);
 else finePointerQuery.addListener(initCardTilt);
 renderCart();setupFilters();
 const featured=$("#featuredGrid");if(featured)renderGrid("#featuredGrid",PRODUCTS.slice(0,4));
 const arrivals=$("#arrivalGrid");if(arrivals)renderGrid("#arrivalGrid",PRODUCTS.filter(p=>p.category==="New Arrivals").slice(0,8));
 const year=$("#year");if(year)year.textContent=new Date().getFullYear();
});
