/* Framework-free; all selectors and events are scoped to one Shopify section. */
(() => {
  const init = root => {
    if (root.dataset.initialized) return;
    root.dataset.initialized = 'true';
    const $ = s => root.querySelector(s), $$ = s => [...root.querySelectorAll(s)];
    const config = JSON.parse($('[data-product-config]').textContent);
    const live = root.dataset.shopify === 'true';
    const money = n => new Intl.NumberFormat(document.documentElement.lang || 'en-US', {style:'currency',currency:config.currency || 'USD'}).format(n/100);
    const variants = config.variants;
    let selected, busy = false, lastFocus;
    let subscription = config.subscriptionDefault !== false;
    const image = $('[data-main-image]');
    const stage = $('[data-stage-caption]');
    const imageDialog = $('[data-image-dialog]');
    const cartDialog = $('[data-cart-dialog]');
    const form = $('[data-product-form]');
    const status = $('[data-form-status]');
    const route = config.routesRoot || '/';
    const effectivePrice = variant => subscription && variant?.subscription_price ? variant.subscription_price : variant?.price || 0;
    const sellingPlan = variant => subscription ? (variant?.selling_plan_id || '') : '';
    function updateSubscriptionCopy() {
      $$('span').filter(e=>e.textContent.trim()==='No automatic refills').forEach(e=>e.textContent='Refills are optional');
      $$('.shv-reason p').filter(e=>e.textContent.includes('one-time purchase')).forEach(e=>e.textContent='Two capsules with a meal. Choose a one-time purchase or optional automatic refills.');
      const routine=$('.shv-routine .shv-muted');
      if(routine) routine.textContent='With a meal, at a time that works for you. Choose a one-time purchase or save 20% with optional automatic refills.';
      $$('details').forEach(detail=>{if(detail.querySelector('summary')?.textContent.includes('enrolled in a subscription')){detail.querySelector('p').textContent='Only when you select the automatic-refill checkbox. Refills save 20%, ship when your selected supply runs out, and can be cancelled anytime. Uncheck the box for a one-time purchase.';}});
    }
    function announce(message) { status.textContent=message; }
    function emit(name, extra={}) {
      root.dispatchEvent(new CustomEvent('shevelia:'+name,{bubbles:true,detail:{product:config.handle,variant:selected?.id,...extra}}));
    }
    function setImage(src,alt) {
      image.src=src; image.alt=alt; image.style.objectFit='contain';
      $$('[data-gallery-image]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.galleryImage===src)));
    }
    function updateOfferCards() {
      $$('[data-variant-radio]').forEach(r=>{
        const variant=variants.find(v=>String(v.id)===String(r.value));
        if(!variant) return;
        const bottles=variant.bottles || parseInt(variant.title,10) || 1;
        const optionPrice=effectivePrice(variant);
        const option=r.closest('.shv-option');
        option.querySelector('.shv-option-detail').textContent=`${bottles*30}-day supply · ${money(Math.round(optionPrice/bottles))} per bottle`;
        const total=option.querySelector('.shv-option-price');
        total.childNodes[0].nodeValue=money(optionPrice);
        total.querySelector('small').textContent=subscription?'automatic-refill total':'one-time total';
      });
    }
    function choose(id,updateURL=true) {
      selected=variants.find(v=>String(v.id)===String(id)) || variants.find(v=>v.available) || variants[0];
      if(!selected){announce('This product is currently unavailable.');$$('[data-add]').forEach(b=>b.disabled=true);return;}
      $$('[name="id"]').forEach(r=>{if(r.type==='radio')r.checked=String(r.value)===String(selected.id);else r.value=selected.id;});
      const price=effectivePrice(selected), total=money(price), count=selected.bottles || parseInt(selected.title,10) || 1;
      $$('[data-current-price]').forEach(e=>e.textContent=total);
      $$('[data-compare-price]').forEach(e=>{e.textContent=money(selected.compare_at_price || 0);e.hidden=!(selected.compare_at_price>price);});
      $$('[data-saving]').forEach(e=>{e.hidden=!(selected.compare_at_price>price);e.textContent='Save '+money(selected.compare_at_price-price);});
      $$('[data-current-supply]').forEach(e=>e.textContent=`${count} ${count===1?'bottle':'bottles'} · ${count*30}-day supply`);
      $$('[data-unit-price]').forEach(e=>e.textContent=`${money(Math.round(price/count))} per bottle · ${subscription?'Automatic refills':'One-time purchase'}`);
      $$('[data-purchase-type]').forEach(e=>e.textContent=subscription?'Automatic refills selected. Save 20% on every shipment.':'One-time purchase. No automatic refills.');
      $$('[data-selling-plan]').forEach(e=>e.value=sellingPlan(selected));
      updateOfferCards();
      $$('[data-add]').forEach(b=>{b.disabled=!selected.available || busy;b.querySelector('[data-add-label]').textContent=selected.available?'Add to bag':'Sold out';});
      if(selected.image){setImage(selected.image,`${config.title} — ${count} ${count===1?'bottle':'bottles'}`);$('[data-bundle-thumb]').dataset.galleryImage=selected.image;$('[data-bundle-thumb] img').src=selected.image;$('[data-bundle-thumb]').setAttribute('aria-pressed','true');}
      stage.textContent=`${count} ${count===1?'bottle':'bottles'} · ${count*30} days of daily support`;
      if(updateURL){const url=new URL(location.href);url.searchParams.set('variant',selected.id);history.replaceState(null,'',url);}
      announce('');
    }
    $$('[data-variant-radio]').forEach(r=>r.addEventListener('change',()=>{choose(r.value);emit('bundle_change');}));
    const subscriptionControl=$('[data-subscription]');
    if(subscriptionControl){
      subscriptionControl.checked=subscription;
      subscriptionControl.addEventListener('change',()=>{subscription=subscriptionControl.checked;choose(selected.id,false);emit('purchase_type_change',{purchaseType:subscription?'subscription':'one_time'});});
    }
    $$('[data-gallery-image]').forEach(b=>b.addEventListener('click',()=>{setImage(b.dataset.galleryImage,b.dataset.galleryAlt);emit('gallery_view',{image:b.dataset.galleryAlt});}));
    function openModal(dialog) {lastFocus=document.activeElement;dialog.showModal();}
    $$('[data-zoom]').forEach(b=>b.addEventListener('click',()=>{const target=imageDialog.querySelector('img');target.src=b.dataset.zoom || image.src;target.alt=b.dataset.zoomAlt || image.alt;openModal(imageDialog);}));
    $$('dialog').forEach(d=>{d.querySelector('[data-close]').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});d.addEventListener('close',()=>lastFocus?.focus());});
    function setBusy(value){busy=value;$$('[data-add]').forEach(b=>{b.disabled=value || !selected.available;b.setAttribute('aria-busy',String(value));b.querySelector('[data-add-label]').textContent=value?'Adding…':selected.available?'Add to bag':'Sold out';});}
    async function add(event){
      event?.preventDefault();if(busy||!selected?.available)return;
      const addedVariant = selected;
      setBusy(true);announce('');
      if(!live){
        $('[data-cart-summary]').textContent=`${config.title} · ${selected.title} · ${money(effectivePrice(selected))}`;
        $('[data-cart-title]').textContent='Your selection is ready';
        $('[data-cart-note]').textContent=`This is a local preview. Your ${subscription?'automatic-refill':'one-time'} selection has not been added to the live store. Continue to Shevelia to purchase this exact offer.`;
        $('[data-cart-link]').href=`https://shevelia.co/products/${config.handle}?variant=${selected.id}${sellingPlan(selected)?'&selling_plan='+sellingPlan(selected):''}`;
        $('[data-cart-link]').textContent='Continue to Shevelia';
        openModal(cartDialog);setBusy(false);emit('preview_selection',{purchaseType:subscription?'subscription':'one_time'});return;
      }
      try{
        const item={id:Number(addedVariant.id),quantity:1};
        if(sellingPlan(addedVariant)) item.selling_plan=Number(sellingPlan(addedVariant));
        const res=await fetch(route+'cart/add.js',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},credentials:'same-origin',body:JSON.stringify({items:[item]})});
        const result=await res.json();
        if(!res.ok) throw new Error(typeof result.description==='string'?result.description:'This offer could not be added. Please check availability and try again.');
        $('[data-cart-title]').textContent='Added to your bag';
        $('[data-cart-summary]').textContent=`${config.title} · ${addedVariant.title} · ${money(effectivePrice(addedVariant))}`;
        $('[data-cart-note]').textContent=`Your ${subscription?'automatic-refill':'one-time'} purchase is in your bag. Shipping and any applicable taxes are confirmed at checkout.`;
        $('[data-cart-link]').href=route+'cart';$('[data-cart-link]').textContent='View bag & checkout';
        openModal(cartDialog);emit('add_to_cart',{variant:addedVariant.id,quantity:1,value:effectivePrice(addedVariant)/100,currency:config.currency,purchaseType:subscription?'subscription':'one_time',sellingPlan:sellingPlan(addedVariant)||null});
        document.dispatchEvent(new CustomEvent('cart:refresh',{detail:{cart:result}}));
      }catch(error){announce(error.message || 'We could not connect. Please try again.');status.focus();}
      finally{setBusy(false);}
    }
    form.addEventListener('submit',add);
    $$('[data-sticky-add]').forEach(b=>b.addEventListener('click',add));
    $$('[data-play]').forEach(b=>{const frame=b.closest('.shv-film-frame,.shv-review-video-frame');const v=frame&&frame.querySelector('video');if(!v)return;b.addEventListener('click',async()=>{try{v.muted=false;v.volume=1;await v.play();}catch{v.controls=true;}});v.addEventListener('play',()=>{$$('video').forEach(other=>{if(other!==v){other.pause();other.muted=false;}});v.muted=false;v.volume=1;v.controls=true;b.hidden=true;emit('video_play',{title:v.getAttribute('aria-label')});});v.addEventListener('ended',()=>b.hidden=false);});
    const sticky=$('[data-sticky]');
    if('IntersectionObserver' in window){new IntersectionObserver(([entry])=>{sticky.classList.toggle('is-visible',!entry.isIntersecting && entry.boundingClientRect.bottom<0);sticky.inert=!sticky.classList.contains('is-visible');},{threshold:0}).observe(form);}
    else{sticky.classList.add('is-visible');sticky.inert=false;}
    updateSubscriptionCopy();
    choose(new URL(location.href).searchParams.get('variant') || config.selectedVariant,false);
    window.addEventListener('popstate',()=>choose(new URL(location.href).searchParams.get('variant'),false));
  };
  document.querySelectorAll('.shv-page').forEach(init);
  document.addEventListener('shopify:section:load',e=>e.target.querySelectorAll('.shv-page').forEach(init));
})();
