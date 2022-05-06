let modalQt = 1;
let cart = [];//tudo que adicionar nesse array estara presente no carrinho
let modalKey = 0;

const c =(el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);
//função map(elemento, e o index do array começando em 0);

//listagem das pizzas
pizzaJson.map((item, index)=>{

    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    //preencher as informações em pizza item;
    //append pega o conteudo que já tem em pizza-area
    //e vai adicionar um conteudo
    //o innerhtml irá substituir as pizzas;

    //adicionar o nome
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        //target é o elemento que disparou o evento no caso <'a'> da ancoragem
        //closest pega o item mais proximo, no caso serio o item anterior; 
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;

        modalKey = key;

        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML =pizzaJson[key].description;
        c('.pizzaBig img').src = pizzaJson[key].img;

        c('.pizzaInfo--actualPrice').innerHTML = `R$${pizzaJson[key].price.toFixed(2)}`;
            // afunção forEach ppor receber 3 parametros(item, index, array);

        c('.pizzaInfo--size.selected').classList.remove('selected');

        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex==2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        });
        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display='flex';
            setTimeout(()=>{
        c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    c('.pizza-area').append(pizzaItem);
    //append pega a div de pizza-area e adiciona o pizzaItem;
});

// Eventos do modal
function fecharModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    })
}
cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item)=>{
    item.addEventListener('click', fecharModal);
});
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt>1){
     modalQt--;   
    }
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    //quando clicar em adicionar no carrinho precisamos de todos os dados
    //qual a pizaa, tamanho, quantas;

    //qual a pizza?
    // console.log(`pizza: ${modalKey}`);

    //qual é o tamanho?
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    // console.log(`tamanho: ${size}`);

    //quantas pizzas são?
    // console.log(`quantidade: ${modalQt}`);

    let indentificador = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>{
        return item.indentificador == indentificador;
    });

    if(key>-1){
        cart[key].quantidade += modalQt;
    } else {
     cart.push({
        indentificador,
        id:pizzaJson[modalKey].id,
        size:size,
        quantidade:modalQt
    });   
    }
    fecharModal();
    updatecart()
   
});

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length>0){
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});

function updatecart(){
    c('.menu-openner span').innerHTML = cart.length;
    if(cart.length>0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].quantidade;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P'
                    break;
                case 1:
                    pizzaSizeName = 'M'
                    break;
                case 2:
                    pizzaSizeName = 'G'
                break; 
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].quantidade;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].quantidade>1){
                    cart[i].quantidade--;  
                } else {
                    cart.splice(i, 1);
                }
                updatecart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].quantidade++;
                updatecart();
            });

            c('.cart').append(cartItem);
        }
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        
    } else {
        c('aside').classList.remove('show');
    }
}