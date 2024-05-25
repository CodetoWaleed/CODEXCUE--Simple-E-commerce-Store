// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  let pincodes = {
    "40100" : ["Sargodha", "Punjab"],
    "40101" : ["Karachi", "Sindh"],
    "40102" : ["Quetta", "KPK"],
    "40103" : ["Gawadar", "Balochistan"],

  }
    res.status(200).json(pincodes)
  }
  