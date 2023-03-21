/**
 * @jest-environment jsdom
 */
import {screen, waitFor} from "@testing-library/dom"
import { toHaveStyle } from '@testing-library/jest-dom'
expect.extend({ toHaveStyle })
import BillsUI from "../views/BillsUI.js"
import userEvent from '@testing-library/user-event'
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills"
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      
      
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
      //to-do write expect expression
      document.body.innerHTML = BillsUI({ data:[] })
      /* expect(windowIcon.toHaveStyle("background-color: #7bb1f7")) */
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
        const bills = new Bills({
          document, onNavigate, store: null, localStorage: window.localStorage
        })
     
        document.body.innerHTML = BillsUI({ data: bills })
        const openNewBill = jest.fn(() => bills.handleClickNewBill())
        const newBillBTN = screen.getByTestId('btn-new-bill')
        expect(screen.getByTestId(`btn-new-bill`)).toBeTruthy()

       newBillBTN.addEventListener('click', openNewBill)
        userEvent.click(newBillBTN)
        expect(openNewBill).toHaveBeenCalled() 
        expect(screen.getByTestId(`form-new-bill`)).toBeTruthy()
        
      })
    })
  
  
  })
})
