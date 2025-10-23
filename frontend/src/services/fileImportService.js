import Papa from 'papaparse'
import * as XLSX from 'xlsx'

// Serviço para importação de arquivos CSV e Excel
export const fileImportService = {
  // Processar arquivo CSV
  async processCSV(file) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(`Erro ao processar CSV: ${results.errors[0].message}`))
          } else {
            resolve(results.data)
          }
        },
        error: (error) => {
          reject(new Error(`Erro ao ler arquivo CSV: ${error.message}`))
        }
      })
    })
  },

  // Processar arquivo Excel
  async processExcel(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          
          // Pegar a primeira planilha
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          
          // Converter para JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
          
          if (jsonData.length < 2) {
            reject(new Error('Arquivo Excel deve ter pelo menos um cabeçalho e uma linha de dados'))
            return
          }
          
          // Converter para formato com cabeçalhos
          const headers = jsonData[0]
          const rows = jsonData.slice(1)
          
          const result = rows.map(row => {
            const obj = {}
            headers.forEach((header, index) => {
              obj[header] = row[index] || ''
            })
            return obj
          })
          
          resolve(result)
        } catch (error) {
          reject(new Error(`Erro ao processar arquivo Excel: ${error.message}`))
        }
      }
      
      reader.onerror = () => {
        reject(new Error('Erro ao ler arquivo Excel'))
      }
      
      reader.readAsArrayBuffer(file)
    })
  },

  // Processar arquivo (detecta automaticamente CSV ou Excel)
  async processFile(file) {
    const fileName = file.name.toLowerCase()
    
    if (fileName.endsWith('.csv')) {
      return await this.processCSV(file)
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      return await this.processExcel(file)
    } else {
      throw new Error('Formato de arquivo não suportado. Use CSV ou Excel (.xlsx/.xls)')
    }
  },

  // Validar dados dos eleitores
  validateEleitores(data, eleicaoId) {
    const errors = []
    const eleitores = []
    
    if (!Array.isArray(data) || data.length === 0) {
      errors.push('Arquivo deve conter pelo menos um eleitor')
      return { eleitores, errors }
    }
    
    data.forEach((row, index) => {
      const lineNumber = index + 2 // +2 porque começa na linha 2 (linha 1 é cabeçalho)
      
      // Validar campos obrigatórios
      if (!row.nome || row.nome.trim() === '') {
        errors.push(`Linha ${lineNumber}: Nome é obrigatório`)
      }
      
      if (!row.matricula || row.matricula.trim() === '') {
        errors.push(`Linha ${lineNumber}: Matrícula é obrigatória`)
      }
      
      if (!row.curso || row.curso.trim() === '') {
        errors.push(`Linha ${lineNumber}: Curso é obrigatório`)
      }
      
      // Verificar se matrícula já existe na lista atual
      const matriculaExists = eleitores.some(e => e.matricula === row.matricula.trim())
      if (matriculaExists) {
        errors.push(`Linha ${lineNumber}: Matrícula duplicada na lista`)
      }
      
      // Se não há erros, adicionar eleitor
      if (!errors.some(error => error.includes(`Linha ${lineNumber}`))) {
        eleitores.push({
          nome: row.nome.trim(),
          matricula: row.matricula.trim(),
          curso: row.curso.trim(),
          eleicaoId: eleicaoId
        })
      }
    })
    
    return { eleitores, errors }
  },

  // Gerar template CSV para download
  generateTemplateCSV() {
    const headers = ['nome', 'matricula', 'curso']
    const sampleData = [
      ['João Silva', '2021001234', 'Ciência da Computação'],
      ['Maria Santos', '2021005678', 'Engenharia de Software'],
      ['Pedro Oliveira', '2021009012', 'Sistemas de Informação']
    ]
    
    const csvContent = [headers, ...sampleData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'template_eleitores.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
