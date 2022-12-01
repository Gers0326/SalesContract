App = {
    contracts: {},
    init: async () => {
        console.log("Vamos con toda!");
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        App.render()
    },
    loadWeb3: async () => {
        if (window.ethereum) {
            App.web3Provider = window.ethereum
            await window.ethereum.request({ method: 'eth_requestAccounts' })
            console.log(
                await window.ethereum.request({ method: 'eth_requestAccounts' }),
            )
        } else if (web3) {
            web3 = new Web3(window.web3.currentProvider)
        } else {
            console.log(
                'No ethereum browser is installed. Try it installing MetaMask ',
            )
        }
    },
    loadAccount: async () => {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
        console.log(accounts)
        App.account = accounts[0]
    },
    loadContract: async () => {
        try {
            const res = await fetch('SalesContract.json')
            const salesContractJSON = await res.json()
            console.log(salesContractJSON)
            App.contracts.SalesContract = TruffleContract(salesContractJSON)
            App.contracts.SalesContract.setProvider(App.web3Provider)
            App.salesContract = await App.contracts.SalesContract.deployed()
        } catch (error) {
            console.error(error)
        }
    },
    render: async () => {
        document.getElementById('account').innerText = App.account
    },
    
    renderSales: async () => {
        const SalesCounter = await App.SalesContract.salesCounter()
        const SalesCounterNumber = SalesCounter.toNumber()
    
        let html = ''
    
        for (let i = 1; i <= SalesCounterNumber; i++) {
          const sales = await App.salesContract.sale(i)
          const productName = sales[0].toNumber()
          const description = sales[1]
          const price = sales[2]
          const saleCreatedAt = sales[3]
    
          // Creating a task Card
          let saleElement = `<div class="card bg-dark rounded-0 mb-2">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span>${productName}</span>
              <div class="form-check form-switch">
                <input class="form-check-input" data-id="${price}" type="checkbox" onchange="App.toggleDone(this)" ${
            saleDone === true && 'checked'
          }>
              </div>
            </div>
            <div class="card-body">
              <span>${saledescription}</span>
              <span>${saleDone}</span>
              <p class="text-muted">Task was created ${new Date(
                saleCreatedAt * 1000,
              ).toLocaleString()}</p>
              </label>
            </div>
          </div>`
          html += saleElement
        }
    
        document.querySelector('#tasksList').innerHTML = html
      },
      createSale: async (productName,description,price) => {
        try {
          const result = await App.salesContract.createSale(productName,description,price, {
            from: App.account,
          })
          console.log(result.logs[0].args)
          window.location.reload()
        } catch (error) {
          console.error(error)
        }
      },
      toggleDone: async (element) => {
        const price = element.dataset.id
        await App.salesContract.toggleDone(price, {
          from: App.account,
        })
        window.location.reload()
      },
      abortar: async(price) => {
        // Convierte el precio a ETH
        price  = price*10**18
        const currentAccount = ethereum.selectedAddress

        try{
          if(price > 30){
            await App.SalesContract.abortarCompra(BigInt(price),{
              from: currentAccount,
            });
          }
        }catch(error){
          console.log(error)
        }
      },
      comprar: async(productName,price, addressee) => {

        // Convierte el precio a ETH
        price  = price*10**18

        console.log(price)

        // Esta es la cuenta actual, cuenta de origen
        const currentAccount = ethereum.selectedAddress
        console.log("currentAccount",currentAccount)

          try {
            await App.salesContract.comprar(productName, BigInt(price), {
              from: currentAccount,
            }).then(async(res) => {

              // Respuesta de la promesa
              console.log("res",res)

         
              if(typeof args != 'undefined'){
                // Aqui van las propiedades del emit que retorna de la funcion
                // En este caso retorna las propiedades del evento estado
                const args = res.logs[0].args
                console.log("Args",args)
              }

              // Aqui se hace la transferencia a otra cuenta
              const paramsTransaction = {

                // La cuenta a donde se va a hacer la trasnferencia
                to: addressee,

                // de: la cuenta desde donde se va a hacer la transferencia
                // La actual del metamask
                from: currentAccount,

                // Convierte el valor a Hexadecimal para que funcione
                value: price.toString(16),
              }
      
              await ethereum.request({
                method: 'eth_sendTransaction',
                params: [paramsTransaction]
              }).then(res => {
                console.log("Transaction Completed!!!")
                console.log("res",res)
              }).catch(err => {console.log("Error",err)});


            }).catch(console.log)

            // window.location.reload()
          } catch (error) {
            console.error(error)
          }
      }
}

console.log("App",App)
