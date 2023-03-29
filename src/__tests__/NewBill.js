/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import NewBillUI from "../views/NewBillUI.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import Logout from "../containers/Logout.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it show them in the page", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      expect(screen.getByTestId("expense-type")).toBeTruthy()
      expect(screen.getByTestId("expense-name")).toBeTruthy()
      expect(screen.getByTestId("datepicker")).toBeTruthy()
      expect(screen.getByTestId("amount")).toBeTruthy()
      expect(screen.getByTestId("vat")).toBeTruthy()
      expect(screen.getByTestId("pct")).toBeTruthy()
      expect(screen.getByTestId("commentary")).toBeTruthy()
      expect(screen.getByTestId("file")).toBeTruthy()
    })


  })

  describe("When I am on NewBill Page,I do not fill all fields and I click on Envoyer button", () => {
    test("Then It should rest at NewBills page", () => {
      document.body.innerHTML = NewBillUI();
      
      const inputName = screen.getByTestId("expense-name");
      expect(inputName.value).toBe("");
      const inputDate = screen.getByTestId("datepicker");
      expect(inputDate.value).toBe("");
      const inputAmount = screen.getByTestId("amount");
      expect(inputAmount.value).toBe("");
      const inputAmountV = screen.getByTestId("vat");
      expect(inputAmountV.value).toBe("");
      const inputAmountP = screen.getByTestId("pct");
      expect(inputAmountP.value).toBe("");
      const inputFile = screen.getByTestId("file");
      expect(inputFile.value).toBe("");
      
      const BtnEnvoyer = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => e.preventDefault());
      BtnEnvoyer.addEventListener("submit", handleSubmit);
      fireEvent.submit(BtnEnvoyer);
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
    })
  })
  //test d'intégration POST
  describe("When I am on NewBill Page,I fill all fields and I click on Envoyer button", () => {
    test("Then It should renders Bills page", () => {

      document.body.innerHTML = NewBillUI();
      const inputData = {
        "id": "47qAXb6fIm2zOKkLzMro",
        "vat": "80",
        "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        "status": "pending",
        "type": "Hôtel et logement",
        "commentary": "séminaire billed",
        "name": "encore",
        "fileName": "preview-facture-free-201801-pdf-1.jpg",
        "date": "2004-04-04",
        "amount": "400",
        "commentAdmin": "ok",
        "email": "a@a",
        "pct": "20"
      }
      const inputType = screen.getByTestId("expense-type");
      fireEvent.change(inputType, { target: { value: inputData.type } });
      expect(inputType.value).toBe(inputData.type);
      const inputName = screen.getByTestId("expense-name");
      fireEvent.change(inputName, { target: { value: inputData.name } });
      expect(inputName.value).toBe(inputData.name);
      const inputDate = screen.getByTestId("datepicker");
      fireEvent.change(inputDate, { target: { value: inputData.date } });
      expect(inputDate.value).toBe(inputData.date);
      const inputAmount = screen.getByTestId("amount");
      fireEvent.change(inputAmount, { target: { value: inputData.amount } });
      expect(inputAmount.value).toBe(inputData.amount);
      const inputAmountV = screen.getByTestId("vat");
      fireEvent.change(inputAmountV, { target: { value: inputData.vat } });
      expect(inputAmountV.value).toBe(inputData.vat);
      const inputAmountP = screen.getByTestId("pct");
      fireEvent.change(inputAmountP, { target: { value: inputData.pct } });
      expect(inputAmountP.value).toBe(inputData.pct);
      const inputCom = screen.getByTestId("commentary");
      fireEvent.change(inputCom, { target: { value: inputData.commentary } });
      expect(inputCom.value).toBe(inputData.commentary);
      const inputFile = screen.getByTestId("file");
      const dataFile = new File([], inputData.fileName, { type: 'image/jpg' });
      userEvent.upload(inputFile, dataFile)
      expect(inputFile.files[0]).toStrictEqual(dataFile)
      expect(inputFile.files.item(0)).toStrictEqual(dataFile)
      expect(inputFile.files).toHaveLength(1)  ////sucess

      // localStorage should be populated with form data
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      });
     

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
     /*  window.localStorage.setItem('user', JSON.stringify({
        type: "Empolyee",
        email: "a@a"
      })) */

      
      jest.spyOn(window.localStorage, 'setItem');
     
      const handleSubmit = jest.fn((e)=>{
        e.preventDefault()
        const bill = {
          email: "a@a",
          type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
          name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
          amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
          date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
          vat: e.target.querySelector(`input[data-testid="vat"]`).value,
          pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
          commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
          fileName: e.target.querySelector(`input[data-testid="file"]`).files[0].name,
          status: 'pending'
        }
        window.localStorage.setItem("user", JSON.stringify({
          type: "Empolyee",
          bill: bill,
        }))
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        }; 
        onNavigate(ROUTES_PATH['Bills'])
      
      });

      const BtnEnvoyer = screen.getByTestId("form-new-bill");
      BtnEnvoyer.addEventListener("submit", handleSubmit);
      fireEvent.submit(BtnEnvoyer);
      expect(handleSubmit).toHaveBeenCalled();
      expect(screen.getByText("Mes notes de frais")).toBeTruthy();
      expect(window.localStorage.setItem).toHaveBeenCalled();
/*       expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Employee",
          bill: {
          email: inputData.email,
          type: inputData.type,
          name:  inputData.name,
          amount: parseInt(inputData.amount) ,
          date:  inputData.date,
          vat: inputData.vat,
          pct: parseInt(inputData.pct),
          commentary: inputData.commentary,
          fileName: inputData.fileName,
          status: 'pending'
          }

        })
      ); */
    })
  })

})

describe('Given I am connected Employee', () => {
  describe('I am on NewBill Page ,When I click on disconnect button', () => {
    test(('Then, I should be sent to login page'), () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = NewBillUI()
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