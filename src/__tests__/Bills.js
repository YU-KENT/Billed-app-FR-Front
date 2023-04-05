/**
 * @jest-environment jsdom
 */
import { screen, waitFor } from "@testing-library/dom"
import '@testing-library/jest-dom'
import BillsUI from "../views/BillsUI.js"
import userEvent from '@testing-library/user-event'
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import Bills from "../containers/Bills"
import router from "../app/Router.js";
import Logout from "../containers/Logout.js"

jest.mock("../app/store", () => mockStore)

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
      expect(screen.getByTestId('icon-window')).toBeTruthy()//success 
      //to-do write expect expression
      expect(windowIcon).toHaveClass("active-icon")
    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => { return new Date((b.date)) - new Date((a.date)) } //correction sort date premier bug
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    describe('When I am on Bills Page and I click on newbill button', () => {
      test('Then, newbill form should appear', () => {

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

  describe('When I am on Bills Page, i click the "iconeye"', () => {
    test(('Then, it should show a modal'), () => {
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
      const iconeyes = screen.getAllByTestId('icon-eye')
      const eye = iconeyes[0]
      const handleClickIconEye = jest.fn((eye) => billS.handleClickIconEye(eye))
      expect(screen.getAllByTestId(`icon-eye`)).toBeTruthy() 

      eye.addEventListener('click', handleClickIconEye(eye))
      userEvent.click(eye)
      expect(handleClickIconEye).toHaveBeenCalled()

      const modale = screen.getByTestId('modaleFile')
      expect(modale).toBeTruthy()

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

//test d'intégration GET
describe("Given I am a user connected as Empolyee", () => {
  describe('When I am on Bills Page', () => {
    test(('fetches bills from mock API GET'), async () => {
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getAllByTestId('icon-eye'))
      const IconEyes = screen.getAllByTestId('icon-eye')
      expect(IconEyes.length).toBe(4)
    })
  })
//test 404 et 500 error
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })

    test("fetches bills from an API and fails with 404 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 404"))
          }
        }
      })
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 500"))
          }
        }
      })

      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})