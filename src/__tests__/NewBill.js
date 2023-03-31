/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import Logout from "../containers/Logout.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import router from "../app/Router.js";
import store from"../app/Store.js"

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
    test("Then mail icon in vertical layout should be highlighted", async () => {  
      
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const MailIcon = screen.getByTestId('icon-mail')
      expect(screen.getByTestId('icon-mail')).toBeTruthy()//success 
      expect(MailIcon).toHaveClass("active-icon")  
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

  describe("When I am on NewBill Page", () => {
    ;
    document.body.innerHTML = NewBillUI();
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    
    const store = null;
    const newBill = new NewBill({
      document,
      onNavigate,
      store,
      localStorage: window.localStorage,
    });
   /*  beforeEach(() => newBill.store = jest.fn().mockResolvedValue({})) */

    test("I update file is not 'jpg''pgn''jpeg',a error message should appear",() => {
    const fakeFile1 = {
        "fileName": "fakeFile.pdf",
      }
    const inputFile = screen.getByTestId("file");
    const divFile = inputFile.parentElement
    const handleChangeFile = jest.fn(newBill.handleChangeFile);
    inputFile.addEventListener("change", handleChangeFile)
    const dataFile1 = new File([],fakeFile1.fileName,{ type:'pdf' });
    userEvent.upload(inputFile, dataFile1)
    expect(inputFile.files).toHaveLength(1)
    expect(handleChangeFile).toHaveBeenCalled()
    expect(divFile).toBeTruthy()
    expect(divFile).toHaveAttribute("data-error-visible","true") 
  })
    
test("I update a 'jpg'file, it dont show error message",()=>{
  /*     document.body.innerHTML = NewBillUI();
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    const store = jest.fn().mockResolvedValue({});
    const newBill = new NewBill({
      document,
      onNavigate,
      store,
      localStorage: window.localStorage,
    }); */
    
    const handleChangeFile = jest.fn(newBill.handleChangeFile); 
    
      const fakeFile2 = {
        "fileName": "fakeFile.jpg",
      }
      const dataFile2 = new File([],fakeFile2.fileName,{ type:'jpg' });
      const inputFile = screen.getByTestId("file");
      
      const divFile = inputFile.parentElement
      inputFile.value = ""
      inputFile.addEventListener("change", handleChangeFile)
      userEvent.upload(inputFile, dataFile2)
    
      expect(inputFile.files).toHaveLength(1)
      expect(handleChangeFile).toHaveBeenCalled()
      expect(divFile).toBeTruthy()
      expect(divFile).toHaveAttribute("data-error-visible","false")
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
      window.localStorage.setItem('user', JSON.stringify({
        type: "Empolyee",
        email: "a@a"
      }))

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = jest.fn();
      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
      const handleSubmit = jest.fn(newBill.handleSubmit);
      newBill.updateBill = jest.fn().mockResolvedValue({});
      const BtnEnvoyer = screen.getByTestId("form-new-bill");
      BtnEnvoyer.addEventListener("submit", handleSubmit);
      fireEvent.submit(BtnEnvoyer);
      expect(handleSubmit).toHaveBeenCalled();
      expect(screen.getByText("Mes notes de frais")).toBeTruthy();
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

