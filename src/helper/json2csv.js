import { Parser, Transform } from "json2csv";

export const convertToCsv = (request) => {
  const requestToObject = request.toObject();
  const parser = new Parser();
  return parser.parse(requestToObject);
};
