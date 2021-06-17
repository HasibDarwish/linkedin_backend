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
				text: "Personal Information\n".toUpperCase(),
				color: "orangered",
				fontSize: 25,
				alignment: "center",
				margin: [1, 1, 1, 30],
			},
			{
				columns: [
					{
						image: img,
						width: 200,
						height: 200,
					},
					{
						text: [
							"",
							{text: "Name: ", bold: true},
							{text: heading.name},
							"\n",
							{text: "Surname: ", bold: true},
							{text: heading.surname},
							"\n",
							{text: "Title: ", bold: true},
							{text: heading.title},
							"\n",
							{text: "Address: ", bold: true},
							{text: heading.area},
							"\n",
							{text: "Biography: ", bold: true},
							{text: heading.bio},
							"",
						],
						margin: [30, 1, 5, 1],
						fontSize: 16,
						lineHeight: [1.5],
						color: "dodgerblue",
						bold: false,
					},
				],
			},
			{
				text: "Experience List\n".toUpperCase(),
				color: "orangered",
				fontSize: 25,
				margin: [1, 30, 1, 30],
				alignment: "center",
			},
			{
				columns: [
					{
						text: [
							"",
							{text: "Company: ", bold: true},
							{text: heading.experiences[0]["company"]},
							"\n",
							{text: "Area: ", bold: true},
							{text: heading.experiences[0]["area"]},
							"\n",
							{text: "Role: ", bold: true},
							{text: heading.experiences[0]["role"]},
							"\n",
							{text: "Description: ", bold: true},
							{text: heading.experiences[0]["description"]},
							"\n",
							{text: "Start Date: ", bold: true},
							{text: heading.experiences[0]["startDate"]},
							"\n",
							{text: "End Date: ", bold: true},
							{text: heading.experiences[0]["endDate"]},
							"\n",
						],
						fontSize: 16,
						lineHeight: [1.5],
						color: "black",
						bold: false,
					},
					{
						text: [
							"",
							{text: "Company: ", bold: true},
							{text: heading.experiences[1]["company"]},
							"\n",
							{text: "Area: ", bold: true},
							{text: heading.experiences[1]["area"]},
							"\n",
							{text: "Role: ", bold: true},
							{text: heading.experiences[1]["role"]},
							"\n",
							{text: "Description: ", bold: true},
							{text: heading.experiences[1]["description"]},
							"\n",
							{text: "Start Date: ", bold: true},
							{text: heading.experiences[1]["startDate"]},
							"\n",
							{text: "End Date: ", bold: true},
							{text: heading.experiences[1]["endDate"]},
							"\n",
						],
						fontSize: 16,
						lineHeight: [1.5],
						color: "black",
						bold: false,
					},
				],
			},
		],
	};

	const printer = new PdfPrinter(font);
	const pdfDoc = printer.createPdfKitDocument(dd);
	pdfDoc.end();

	return pdfDoc;
};
