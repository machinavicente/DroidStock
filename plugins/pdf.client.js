// plugins/pdf.client.js
import html2pdf from 'html2pdf.js'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      html2pdf,
      jsPDF
    }
  }
})