import PdfPrinter from "pdfmake";

export const createPDf = (img,heading, body) => {
	const font = {
		Roboto: {
			normal: "Times-Roman",
			bold: "Times-Bold",
			italics: "Times-Italic",
			bolditalics: "Times-BoldItalic",
		},
	};

	const dd = {
		content: [
			{
				image: img,
				alignment: "center",
				fit: [500, 600],
			},
			{
				text: heading.toUpperCase(),
				margin: [10, 20],
				fontSize: 28.8,
				color: "orangered",
				bold: true,
			},
			{
				text: body,
				fontSize: 16,
				color: "dodgerblue",
				margin: [10, -15],
			},
		],
	};

	const printer = new PdfPrinter(font);
	const pdfDoc = printer.createPdfKitDocument(dd);
	pdfDoc.end();

	return pdfDoc;
};
