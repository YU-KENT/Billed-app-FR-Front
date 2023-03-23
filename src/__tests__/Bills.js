/**
 * @jest-environment jsdom
 */
import {screen, waitFor} from "@testing-library/dom"
import '@testing-library/jest-dom'
import BillsUI from "../views/BillsUI.js"
import userEvent from '@testing-library/user-event'
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills"
import router from "../app/Router.js";
import Actions from "../views/Actions.js"
import Logout from "../containers/Logout.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {  ///wrong
      
      
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(screen.getByTestId('icon-window')).toBeTruthy()//success 
      //to-do write expect expression
      /* document.body.innerHTML = BillsUI({ data:[] }) */
      expect(windowIcon.toHaveClass("active-icon"))
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => {return new Date((b.date)) - new Date((a.date))} //correction sort date
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    describe('When I am on Bills Page and I click on newbill btn', () => {
      test('Then, new bill form should appear',  () => {
       
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const billS = new Bills({
          document, onNavigate, store: null, localStorage: window.localStorage
        })
     
        document.body.innerHTML = BillsUI({ data: bills })
        const openNewBill = jest.fn(() => billS.handleClickNewBill())
        const newBillBTN = screen.getByTestId('btn-new-bill')
        expect(screen.getByTestId(`btn-new-bill`)).toBeTruthy()

       newBillBTN.addEventListener('click', openNewBill)
        userEvent.click(newBillBTN)
        expect(openNewBill).toHaveBeenCalled() 
        expect(screen.getByTestId(`form-new-bill`)).toBeTruthy()
        
      })
    })
  })
  describe('When I am on Bills Page', () => {
    test(('Then, it should show bills info'), () => {
      
      document.body.innerHTML = BillsUI({ data: bills })
      expect(screen.getByText(bills[0].name)).toBeTruthy()
    })
  }) 
  describe('When I am on Bills Page, i click the "iconeye"', () => {
    test(('Then, it should show a modal'), async() => {   //wrong
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const billS = new Bills({
          document, onNavigate, store: null, localStorage: window.localStorage
        })
       /*   const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills) 
       */
      document.body.innerHTML = Actions(bills[0].fileUrl)
      await waitFor(() => screen.getByTestId('icon-eye') )
      const handleClickIconEye = jest.fn(() => billS.handleClickIconEye())
      const iconeye = screen.getByTestId('icon-eye')
      expect(screen.getByTestId(`icon-eye`)).toBeTruthy()  //success 
      
      iconeye.addEventListener('click', handleClickIconEye(iconeye))
      userEvent.click(iconeye)
      expect(handleClickIconEye).toHaveBeenCalled() // not working
 
   /*    expect(handleClickIconEye).toHaveBeenCalled() */

      /*  const modale = screen.getByTestId('modaleFile')
      expect(modale).toBeTruthy()   */
      
    })
  }) 
})
describe('Given I am connected Employee', () => {
  describe('When I click on disconnect button', () => {
    test(('Then, I should be sent to login page'), () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
      document.body.innerHTML = BillsUI({ data: bills })
      const logout = new Logout({ document, onNavigate, localStorage })
      const handleClick = jest.fn(logout.handleClick)

      const disco = screen.getByTestId('layout-disconnect')
      disco.addEventListener('click', handleClick)
      userEvent.click(disco)
      expect(handleClick).toHaveBeenCalled()
      expect(screen.getByText('Employé')).toBeTruthy()
    })
  })
})
