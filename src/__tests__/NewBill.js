/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { getByTestId } from '@testing-library/dom'
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
    test("Then new bill icon in vertical layout should be highlighted", async () => {
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
      await waitFor(() => screen.getByTestId('icon-mail')) 
      const icon = screen.getByTestId('icon-mail')
      expect(icon).toHaveClass('active-icon')
    })
  })

  describe("When I am on NewBill Page", () => {
   
      // se connecter en tant que employé 
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.innerHTML = ''

      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      // initialisation de newBill 
      const newBill = new NewBill({
        document, onNavigate, store: mockStore, bills: bills, localStorage: window.localStorage
      });

      const spyHandleChangeFile = jest.spyOn(newBill, 'handleChangeFile')
      const file = screen.getByTestId('file')

      const typeAllow = "image/jpeg";

      file.addEventListener('change', newBill.handleChangeFile)
      const fileType = new File(['TestFile'], 'test.jpg', {type: 'image/jpeg'})
      userEvent.upload(file, fileType)

    test('Then file input should contain the file', async () => {
      expect(spyHandleChangeFile).toHaveBeenCalled()
      // on vérifie que le fichier envoyé est bien égale à un fichier autorisé envoyé 
      expect(file.files[0].type).toEqual(typeAllow)
      // on vérifie qu'il y a bien un SEUL fichier envoyé 
      expect(file.files).toHaveLength(1)
      expect(file.files[0].name).toEqual('test.jpg')
    })
})

  describe("When I am on NewBill Page", () => {
    
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

      const handleChangeFile = jest.fn((e)=> newBill.handleChangeFile(e))
      const file= screen.getByTestId('file')
      file.addEventListener('change', handleChangeFile)
      const fileType = new File(['TestFile'], 'test.pdf', {type: 'application/pdf'})
      const typeAllow = "image/jpeg";
      userEvent.upload(file, fileType)

      test("When I am on NewBills Page and I choose a proof file with unsupported file type", async () => {
      expect(handleChangeFile).toHaveBeenCalled()
      // Si un fichier n'est pas autorisé alors il ne sera pas accepter 
      expect(file.files[0].type).not.toEqual(typeAllow)
      // on vérifie qu'il y a bien un SEUL fichier envoyé 
      expect(file.files).toHaveLength(1)
    })


      const handleSubmit = jest.fn((e)=> newBill.handleSubmit(e));
      const form = screen.getByTestId("form-new-bill");
      form.addEventListener('submit',handleSubmit);
      // on simule un clique de souris grâce a fireEvent
      fireEvent.submit(form);
      test('when i click th button it should send the form', () => {
        expect(handleSubmit).toHaveBeenCalled();
      })
  })
})

// INTEGRATION POST NEWBILL 
describe('Given I am connected as an employee', () => {
  describe('When I navigate to NewBills and create a new bill by uploading a valid proof document', () => {
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

  const newBill= new NewBill({
    document, onNavigate, store: mockStore, bills: bills, localStorage: window.localStorage
  })

  // je remplis les champs
  const spyHandleChangeFile = jest.spyOn(newBill, 'handleChangeFile')
   const handleChangeFile = jest.fn((e)=> newBill.handleChangeFile(e))
      const file= screen.getByTestId('file')
      file.addEventListener('change', handleChangeFile)
      const fileType = new File(['TestFile'], 'test.jpg', {type: 'image/jpeg'})
      const typeAllow = "image/jpeg";
      userEvent.upload(file, fileType)
      
    
      expect(spyHandleChangeFile).toHaveBeenCalled()
      // on vérifie que le fichier envoyé est bien égale à un fichier autorisé envoyé 
      expect(file.files[0].type).toEqual(typeAllow)
      // on vérifie qu'il y a bien un SEUL fichier envoyé 
      expect(file.files).toHaveLength(1)
      expect(file.files[0].name).toEqual('test.jpg')
  
    // j'envoie le formulaire 
   const form = screen.getByTestId("form-new-bill");
   const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
   form.addEventListener("submit", handleSubmit);
   fireEvent.submit(form);
   expect(handleSubmit).toHaveBeenCalled()

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
    test("Post bills to an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 404"))
          }
        }
      })
      window.onNavigate(ROUTES_PATH.NewBill)
     
    })

    test("Post bills to an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 500"))
          }
        }
      })

      window.onNavigate(ROUTES_PATH.NewBill)
     
    })
  })
 
  })
})