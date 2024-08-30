const menu = document.getElementById("menu")
const body = document.getElementById("body")
const btnCart= document.getElementById("card-btn")
const modal = document.getElementById("modal-carrinho")
const cartItemsModal = document.getElementById("cart-items") 
const precoTotalModal = document.getElementById("cart-total")
const checkoutBtnModal = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCount = document.getElementById("cart-count")
const addressInput = document.getElementById("endereco")
const checkAddress = document.getElementById("check-address")
const Finally = document.getElementById("checkout-btn")

let cart = []




/* Abrindo modal*/
btnCart.addEventListener("click", ()=>{
    modal.style.display = "flex"
})
/* Fechando o modal clicando fora*/ 
modal.addEventListener("click",(e)=>{
    if(e.target===modal){
        modal.style.display = "none"
    }
})
/*Fechando modal*/
closeModalBtn.addEventListener("click",()=>{
    modal.style.display = "none"

})

//Adicionar item carrinho

menu.addEventListener("click", (e)=>{
    let parentButton = e.target.closest(".add-to-cart-btn") 
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        
        addToCart(name,price)
    }
})

//Função para mandar pro carrinho

function addToCart(name,price){

    const existingItem = cart.find(item=>item.name === name)

    if(existingItem){
        //Se o item existir vai aumentar a quantidade em +1
        existingItem.quantidade += 1
    }else{
        cart.push({
            name,
            price,
            quantidade: 1,
        })
    }
    updateCartModal()
}

// Atualizando o modal e o carrinho
function updateCartModal(){
    cartItemsModal.innerHTML = ''
    let total = 0

    cart.forEach(item=>{
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-between","mb-4","flex-col")
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p class="font-medium mt-2"> Quantidade: ${item.quantidade}</p>
                    <p class="font-medium mt-2"> R$ ${item.price.toFixed(2)}</p>
                </div>
                <button class="remove" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `

        // Contabilizando o total
        total += item.price * item.quantidade
     
        cartItemsModal.appendChild(cartItemElement)
    })

    precoTotalModal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    })

    cartCount.innerText = cart.length;
}

//Função de remover item do carrinho
cartItemsModal.addEventListener("click",(e)=>{
    if(e.target.classList.contains("remove")){
        console.log("clicou")
        const name = e.target.getAttribute("data-name")
        removeItem(name)
    }
})

function removeItem(name){
    const index = cart.findIndex(item=> item.name === name)
        if(index !== -1){
            const item = cart [index]

            if(item.quantidade >1){
                item.quantidade -= 1
                updateCartModal()
                return
            }

            cart.splice(index,1)
            updateCartModal()
        }
    
}

// Pegando valor do input dentro do modal
addressInput.addEventListener("input",(e)=>{
    let inputValue = e.target.value

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        checkAddress.classList.add("hidden")
    }
})

// Finalizando pedido
Finally.addEventListener("click",()=>{
    
    const isOpen = checkRestaurantOpen()
    
    if(!isOpen){
        Toastify({
            text: "O Restaurante está fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
    }).showToast()
        return
    }
    if(cart.length===0){
        return
    }
    if(addressInput.value==""){
        checkAddress.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return
    }
    //Enviando pedido pela api do whats
    
    const cartItems = cart.map((item)=>{
        return(
            `${item.name} Quantidade: (${item.quantidade}) Preço: R$: (${item.price})`
        )
    }).join("")

    const menssagem = encodeURIComponent(cartItems)
    const phone = "21996393076"

    window.open(`https://wa.me/${phone}?text=${menssagem} endereço ${addressInput.value}`, "_blanck")

    cart = []
    updateCartModal()
})


//Verificar a hora de funcionamento

function checkRestaurantOpen(){
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 23
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-500")
}else{
    spanItem.classList.add("bg-red-500")
    spanItem.classList.remove("bg-green-500")
}














