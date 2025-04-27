import * as XLSX from "xlsx"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

// 导出数据到Excel
export const exportToExcel = (data: any[], fileName: string) => {
  try {
    // 创建工作簿
    const workbook = XLSX.utils.book_new()

    // 将数据转换为工作表
    const worksheet = XLSX.utils.json_to_sheet(data)

    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, "数据")

    // 生成Excel文件并下载
    XLSX.writeFile(workbook, `${fileName}.xlsx`)
  } catch (error) {
    console.error("导出Excel失败:", error)
    throw new Error("导出Excel失败")
  }
}

// 导出图表到PDF
export const exportToPDF = async (element: HTMLElement | null, title: string, fileName: string) => {
  if (!element) return

  try {
    // 使用html2canvas将元素转换为canvas
    const canvas = await html2canvas(element, {
      scale: 2, // 提高清晰度
      logging: false,
      useCORS: true, // 允许跨域图片
      allowTaint: true,
    })

    // 获取canvas的宽度和高度
    const imgData = canvas.toDataURL("image/png")
    const imgWidth = 210 // A4宽度，单位mm
    const pageHeight = 297 // A4高度，单位mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // 创建PDF文档
    const pdf = new jsPDF("p", "mm", "a4")

    // 添加标题
    pdf.setFontSize(16)
    pdf.text(title, 105, 15, { align: "center" })

    // 添加图表
    pdf.addImage(imgData, "PNG", 10, 25, imgWidth - 20, imgHeight)

    // 添加页脚
    pdf.setFontSize(10)
    const today = new Date().toLocaleDateString("zh-CN")
    pdf.text(`生成日期: ${today}`, 10, pageHeight - 10)
    pdf.text("言语「逸品」数字驾驶舱", 105, pageHeight - 10, { align: "center" })
    pdf.text(`第1页`, 200, pageHeight - 10, { align: "right" })

    // 保存PDF
    pdf.save(`${fileName}.pdf`)
  } catch (error) {
    console.error("导出PDF失败:", error)
    throw new Error("导出PDF失败")
  }
}

// 导出数据到CSV
export const exportToCSV = (data: any[], fileName: string) => {
  try {
    // 将数据转换为CSV格式
    const worksheet = XLSX.utils.json_to_sheet(data)
    const csv = XLSX.utils.sheet_to_csv(worksheet)

    // 创建Blob对象
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })

    // 创建下载链接
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `${fileName}.csv`)
    link.style.visibility = "hidden"

    // 添加到文档并触发下载
    document.body.appendChild(link)
    link.click()

    // 清理
    document.body.removeChild(link)
  } catch (error) {
    console.error("导出CSV失败:", error)
    throw new Error("导出CSV失败")
  }
}
