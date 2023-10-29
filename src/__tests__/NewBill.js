/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import {ROUTES_PATH} from "../constants/routes.js";
import { fireEvent, screen,waitFor } from "@testing-library/dom";
import userEvent from '@testing-library/user-event';
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import { bills } from '../fixtures/bills.js' 
import router from "../app/Router.js";

jest.mock('../app/Store', () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("When I am on NewBills Page and I choose a proof file with supported file type", async () => {
      // se connecter en tant que employé 
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
    const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      // initialisation de newBill 
      const newBill = new NewBill({
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      });

      const spyHandleChangeFile = jest.spyOn(newBill, 'handleChangeFile')
    const file= screen.getByTestId('file')

    file.addEventListener('change', newBill.handleChangeFile)
    const fileType = new File(['TestFile'], 'test.jpg', {type: 'image/jpeg'})
    const typeAllow = "image/jpeg";
    userEvent.upload(file, fileType)

    
      expect(spyHandleChangeFile).toHaveBeenCalled()
      // on vérifie que le fichier envoyé est bien égale à un fichier autorisé envoyé 
      expect(file.files[0].type).toEqual(typeAllow)
      // on vérifie qu'il y a bien un SEUL fichier envoyé 
      expect(file.files).toHaveLength(1)
    })
  })

  describe("When I am on NewBill Page", () => {
    test("When I am on NewBills Page and I choose a proof file with unsupported file type", async () => {
      // se connecter en tant que employé 
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
    const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      // initialisation de newBill 
      const newBill = new NewBill({
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      });

      const spyHandleChangeFile = jest.spyOn(newBill, 'handleChangeFile')
    const file= screen.getByTestId('file')

    file.addEventListener('change', newBill.handleChangeFile)
    const fileType = new File(['TestFile'], 'test.pdf', {type: 'application/pdf'})
    const typeAllow = "image/jpeg";
    userEvent.upload(file, fileType)

    
      expect(spyHandleChangeFile).toHaveBeenCalled()
      // Si un fichier n'est pas autorisé alors il ne sera pas accepter 
      expect(file.files[0].type).not.toEqual(typeAllow)
      // on vérifie qu'il y a bien un SEUL fichier envoyé 
      expect(file.files).toHaveLength(1)
    
    })
  })
})

