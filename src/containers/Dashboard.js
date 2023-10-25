import { formatDate } from '../app/format.js'
import DashboardFormUI from '../views/DashboardFormUI.js'
import BigBilledIcon from '../assets/svg/big_billed.js'
import { ROUTES_PATH } from '../constants/routes.js'
import USERS_TEST from '../constants/usersTest.js'
import Logout from "./Logout.js"

// data = toutes les bills data.length = nombre de bills en tout  
export const filteredBills = (data, status) => {
  return (data && data.length) ?
    data.filter(bill => {
      let selectCondition
      console.log(typeof jest)
      // in jest environment
      if (typeof jest !== 'undefined') {
        selectCondition = (bill.status === status)
        console.log(selectCondition)
      }
      /* istanbul ignore next */
      else {
        // in prod environment
        const userEmail = JSON.parse(localStorage.getItem("user")).email
        console.log(userEmail)
        selectCondition =
          (bill.status === status) &&
          ![...USERS_TEST, userEmail].includes(bill.email)
          console.log(selectCondition)
      }

      return selectCondition
    }) : []
}

export const card = (bill) => {
  const firstAndLastNames = bill.email.split('@')[0]
  const firstName = firstAndLastNames.includes('.') ?
    firstAndLastNames.split('.')[0] : ''
  const lastName = firstAndLastNames.includes('.') ?
    firstAndLastNames.split('.')[1] : firstAndLastNames

  return (`
    <div class='bill-card' id='open-bill${bill.id}' data-testid='open-bill${bill.id}'>
      <div class='bill-card-name-container'>
        <div class='bill-card-name'> ${firstName} ${lastName} </div>
        <span class='bill-card-grey'> ... </span>
      </div>
      <div class='name-price-container'>
        <span> ${bill.name} </span>
        <span> ${bill.amount} € </span>
      </div>
      <div class='date-type-container'>
        <span> ${formatDate(bill.date)} </span>
        <span> ${bill.type} </span>
      </div>
    </div>
  `)
}

// cards multiplie card
export const cards = (bills) => {
  return bills && bills.length ? bills.map(bill => card(bill)).join("") : ""
}

// getStatus permet de savoir qui appartient à quelle index ex:case 1 les bills seront dirigé vers pending
export const getStatus = (index) => {
  switch (index) {
    case 1:
      return "pending"
    case 2:
      return "accepted"
    case 3:
      return "refused"
  }
}

export default class {
  constructor({ document, onNavigate, store, bills, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    $('#arrow-icon1').on('click', (e) => { this.handleShowTickets(e, bills, 1, console.log(e, bills, 1)) })
    $('#arrow-icon2').on('click', (e) => this.handleShowTickets(e, bills, 2))
    $('#arrow-icon3').on('click', (e) => this.handleShowTickets(e, bills, 3))
    new Logout({ localStorage, onNavigate })
  }

  handleClickIconEye = () => {
    const billUrl = $('#icon-eye-d').attr("data-bill-url")
    const imgWidth = Math.floor($('#modaleFileAdmin1').width() * 0.8)
    $('#modaleFileAdmin1').find(".modal-body").html(`<div style='text-align: center;'><img width=${imgWidth} src=${billUrl} alt="Bill"/></div>`)
    if (typeof $('#modaleFileAdmin1').modal === 'function') $('#modaleFileAdmin1').modal('show')
  }

  handleEditTicket(e, bill, bills) {
    
    if (this.counter === undefined || this.id !== bill.id) this.counter = 0;
    if (this.id === undefined || this.id !== bill.id) this.id = bill.id;
    console.log(bill.id);
    
    if (this.counter % 2 === 0) {
      bills.forEach(b => {
        // pair 
        // tu m'affiches l'edit ticket 
        $(`#open-bill${b.id}`).css({ background: '#0D5AE5' })
      })
      $(`#open-bill${bill.id}`).css({ background: 'green' })
      $('.dashboard-right-container div').html(DashboardFormUI(bill))
      $('.vertical-navbar').css({ height: '150vh' })
      
      this.counter++
    } else {
        
        // tu m'affiches pas l'edit ticket 
        $(`#open-bill${bill.id}`).css({ background: 'red' })
        // 0D5AE5
        $('.dashboard-right-container div').html(`
          <div id="big-billed-icon" data-testid="big-billed-icon"> ${BigBilledIcon} </div>
        `)
        $('.vertical-navbar').css({ height: '120vh' })
        this.counter++

      }

    $('#icon-eye-d').click(this.handleClickIconEye)
    $('#btn-accept-bill').click((e) => this.handleAcceptSubmit(e, bill))
    $('#btn-refuse-bill').click((e) => this.handleRefuseSubmit(e, bill))
  
    return bills
  }

  handleAcceptSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: 'accepted',
      commentAdmin: $('#commentary2').val()
    }
    this.updateBill(newBill)
    this.onNavigate(ROUTES_PATH['Dashboard'])
  }

  handleRefuseSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: 'refused',
      commentAdmin: $('#commentary2').val()
    }
    this.updateBill(newBill)
    this.onNavigate(ROUTES_PATH['Dashboard'])
  }
  
  handleShowTickets(e, bills, index) {
    if (this.counter === undefined || this.index !== index) this.counter = 0
    if (this.index === undefined || this.index !== index) this.index = index
  
    if (this.counter % 2 === 0) {
      // contenu type de ce que va retourner cette fonction pour chaque staus un arrow une div container dans la quelle vont apparaitre les cards 
      $(`#arrow-icon${this.index}`).css({ transform: 'rotate(0deg)' })
      $(`#status-bills-container${this.index}`)
        .html(cards(filteredBills(bills, getStatus(this.index))))
        // arrayFilterByStatus tableau de tous les éléments par status exemple : refusé 2 [{..},{..}]
        let arrayFilterByStatus = filteredBills(bills, getStatus(this.index))
      console.log(arrayFilterByStatus)
        arrayFilterByStatus.forEach(bill => {
          // Chaque clique affichera le editicket de notre card 
          $(`#open-bill${bill.id}`).click((e) => {this.handleEditTicket(e, bill, bills)})
    
        })
      this.counter++
    } else {
      $(`#arrow-icon${this.index}`).css({ transform: 'rotate(90deg)' })
      $(`#status-bills-container${this.index}`)
        .html("")
      this.counter++
    }
    return bills
  }

  getBillsAllUsers = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then(snapshot => {
          const bills = snapshot
            .map(doc => ({
              id: doc.id,
              ...doc,
              date: doc.date,
              status: doc.status
            }))
          return bills
        })
        .catch(error => {
          throw error;
        })
    }
  }

  // not need to cover this function by tests
  /* istanbul ignore next */
  updateBill = (bill) => {
    if (this.store) {
      return this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: bill.id })
        .then(bill => bill)
        .catch(console.log)
    }
  }
}
