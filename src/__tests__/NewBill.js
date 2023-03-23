/**
 * @jest-environment jsdom
 */

import { fireEvent,screen } from "@testing-library/dom"

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


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

      const inpuMontant = screen.getByTestId("vat");
      expect(inpuMontant.value).toBe("");

      const BtnEnvoyer = screen.getByText("Envoyer");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      BtnEnvoyer.addEventListener("submit", handleSubmit);
      fireEvent.submit(BtnEnvoyer);
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
    })
  })

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
        fireEvent.change(inputCom , { target: { value: inputData.commentary } });
        expect(inputCom.value).toBe(inputData.commentary);
        
        let fileUrl = inputData.fileUrl
        let fileName = inputData.fileName

        const BtnEnvoyer = screen.getByText("Envoyer");
        const handleSubmit = jest.fn((e) => e.preventDefault());
        BtnEnvoyer.addEventListener("submit", handleSubmit);
        fireEvent.submit(BtnEnvoyer);
        expect(handleSubmit).toHaveBeenCalled(); //OK 
        expect(screen.getByText("Mes notes de frais")).toBeTruthy(); //wrong still in newBill page


    })
  })

})
