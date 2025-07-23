import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../../assets/logo.png";
import signatureImg from "../../assets/logo.png";
import { toWords } from "number-to-words";

// Format Date
const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// Styles
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: "Helvetica", color: "#000" },
  row: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  logo: { fontSize: 14, color: "#007bff", fontWeight: "bold" },
  heading: {
    textAlign: "right",
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
  },
  topRight: { textAlign: "right", fontSize: 9, marginTop: 2 },
  blueLabel: {
    backgroundColor: "#007bff",
    color: "white",
    paddingVertical: 3,
    paddingHorizontal: 6,
    fontWeight: "bold",
    fontSize: 10,
    marginBottom: 4,
  },
  box: {
    border: "1px solid #007bff",
    padding: 6,
    fontSize: 10,
    marginBottom: 6,
    lineHeight: 1.5,
  },
  bold: { fontWeight: "bold" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    color: "white",
    fontWeight: "bold",
    paddingVertical: 5,
    paddingHorizontal: 3,
    fontSize: 9,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 3,
    borderBottom: "1px solid #ccc",
    fontSize: 9,
  },
  cell: { flex: 1, paddingHorizontal: 3 },
  rightAlign: { textAlign: "right" },
  qtyBox: {
    backgroundColor: "#007bff",
    color: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontWeight: "bold",
    fontSize: 10,
    marginTop: 6,
    width: "100%",
  },
  taxSummaryHeader: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    color: "white",
    fontWeight: "bold",
    fontSize: 9,
    padding: 4,
    marginTop: 10,
  },
  taxSummaryRow: { flexDirection: "row", fontSize: 9, padding: 4 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
    fontSize: 10,
  },
  totalAmountBox: {
    backgroundColor: "#007bff",
    color: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 1,
    fontSize: 11,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    alignItems: "center",
  },

  totalAmountLabel: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 10,
  },

  totalAmountValue: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 10,
  },
  footerText: { fontSize: 9, marginTop: 8 },
  bankRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 10,
  },

  signature: {
    width: 100,
    height: 50,
    objectFit: "contain",
    marginLeft: 20,
  },
  right: { textAlign: "right" },
  powered: { fontSize: 7, color: "gray", marginTop: 6, textAlign: "right" },
});

const GeneratePerformaPDF = ({ formData, invoiceNo = 100 }) => {
  const {
    name,
    address,
    gstNo,
    mobileNumber,
    date,
    validUntil,
    taxType,
    selectedServiceData = [],
  } = formData;

  let cgst = 0,
    sgst = 0,
    igst = 0,
    subTotal = 0;
  const hsnWiseSummary = {};
  let totalQty = 0;

  selectedServiceData.forEach((item) => {
    const amount = item.price * item.quantity;
    const gstPercent = Number(item.taxPercent || 0);
    const hsn = item.hsnCode || "N/A";
    totalQty += Number(item.quantity || 0);
    subTotal += amount;

    if (taxType === "intra") {
      const half = (amount * gstPercent) / 200;
      cgst += half;
      sgst += half;
    } else {
      igst += (amount * gstPercent) / 100;
    }

    if (!hsnWiseSummary[hsn]) {
      hsnWiseSummary[hsn] = { amount: 0, gstPercent };
    }
    hsnWiseSummary[hsn].amount += amount;
  });

  const total = subTotal + cgst + sgst + igst;
  const convertToWords = (num) => {
    return toWords(num).replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize each word
  };
  const convertToCurrencyWords = (num) => {
    const integerPart = Math.floor(num); // ₹ part
    const decimalPart = Math.round((num - integerPart) * 100); // paise part

    const integerWords = convertToWords(integerPart); // e.g. "Six Thousand"

    let result = `Indian Rupees ${integerWords}`;
    if (decimalPart > 0) {
      const paiseWords = convertToWords(decimalPart);
      result += ` and ${paiseWords} Paise`;
    }

    return result + " Only";
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.row}>
          <Image src={logo} style={{ width: 140, height: 30 }} />
          <View>
            <Text style={styles.heading}>PROFORMA INVOICE #{invoiceNo}</Text>
            <Text style={styles.topRight}>
              Date: <Text style={styles.bold}>{formatDate(date)}</Text>
            </Text>
            <Text style={styles.topRight}>
              Valid Until:{" "}
              <Text style={styles.bold}>{formatDate(validUntil)}</Text>
            </Text>
          </View>
        </View>

        {/* Buyer/Seller Info */}
        <View style={[styles.row, { marginTop: 16 }]}>
          <View style={{ width: "58%", lineHeight: 1 }}>
            <Text style={styles.bold}>Legal Papers India</Text>
            <Text>B-768, Street 8, Mukandpur, New Delhi 110042</Text>
            <Text>Contact: 9315247392</Text>
            <Text>Email: info@legalpapersindia.com</Text>
            <Text>Website: www.legalpapersindia.com</Text>
            <Text>GSTIN: 07BRPPB7333A1Z3</Text>
          </View>
          <View style={{ width: "40%" }}>
            <Text style={styles.blueLabel}>Bill To:</Text>
            <View style={styles.box}>
              <Text style={styles.bold}>{name}</Text>
              <Text>{address}</Text>
              <Text>Contact: {mobileNumber || "-"}</Text>
              <Text>PoS: 33-Tamil Nadu</Text>
              <Text>GSTIN: {gstNo || "-"}</Text>
            </View>
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, { flex: 0.5 }]}>S.No</Text>
          <Text style={styles.cell}>Particulars</Text>
          <Text style={styles.cell}>HSN/SAC</Text>
          <Text style={styles.cell}>Qty</Text>
          <Text style={[styles.cell, styles.rightAlign]}>Unit Price</Text>
          <Text style={[styles.cell, styles.rightAlign]}>GST%</Text>
          <Text style={[styles.cell, styles.rightAlign]}>Amount</Text>
        </View>

        {/* Table Rows */}
        {selectedServiceData.map((item, i) => {
          const amount = item.price * item.quantity;
          const gstPercent = Number(item.taxPercent || 0);
          const gstRate = taxType === "intra" ? gstPercent / 2 : gstPercent;

          return (
            <View style={styles.tableRow} key={i}>
              <Text style={[styles.cell, { flex: 0.5 }]}>{i + 1}</Text>
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cell}>{item.hsnCode}</Text>
              <Text style={styles.cell}>{item.quantity}</Text>
              <Text style={[styles.cell, styles.rightAlign]}>
                {item.price.toFixed(2)}
              </Text>
              <Text style={[styles.cell, styles.rightAlign]}>
                {gstRate.toFixed(0)}%
              </Text>
              <Text style={[styles.cell, styles.rightAlign]}>
                {amount.toFixed(2)}
              </Text>
            </View>
          );
        })}

        {/* Quantity Summary */}
        <Text style={styles.qtyBox}>Total Qty : {totalQty}</Text>

        {/* HSN/SAC Tax Summary */}
        <View style={styles.taxSummaryHeader}>
          <Text style={[styles.cell]}>HSN/SAC</Text>
          <Text style={[styles.cell]}>GST%</Text>
          <Text style={[styles.cell]}>Amount</Text>
          {taxType === "intra" ? (
            <>
              <Text style={[styles.cell]}>CGST</Text>
              <Text style={[styles.cell]}>SGST</Text>
            </>
          ) : (
            <Text style={[styles.cell]}>IGST</Text>
          )}
        </View>
        {Object.entries(hsnWiseSummary).map(([hsn, data], i) => {
          const gst = data.gstPercent;
          const half = taxType === "intra" ? (data.amount * gst) / 200 : 0;
          const displayRate = taxType === "intra" ? gst / 2 : gst;

          return (
            <View style={styles.taxSummaryRow} key={i}>
              <Text style={styles.cell}>{hsn}</Text>
              <Text style={styles.cell}>{displayRate.toFixed(0)}%</Text>
              <Text style={styles.cell}>{data.amount.toFixed(2)}</Text>
              {taxType === "intra" ? (
                <>
                  <Text style={styles.cell}>{half.toFixed(2)}</Text>
                  <Text style={styles.cell}>{half.toFixed(2)}</Text>
                </>
              ) : (
                <Text style={styles.cell}>
                  {((data.amount * gst) / 100).toFixed(2)}
                </Text>
              )}
            </View>
          );
        })}

        {/* Totals */}
        <View style={{ marginTop: 6, marginLeft: "auto", width: "50%" }}>
          <View style={styles.summaryRow}>
            <Text>Sub Total</Text>
            <Text>{subTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Tax Amount (+)</Text>
            <Text>{(cgst + sgst + igst).toFixed(2)}</Text>
          </View>
          <View style={styles.totalAmountBox}>
            <Text style={styles.totalAmountLabel}>TOTAL AMOUNT</Text>
            <Text style={styles.totalAmountValue}>{total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          Amount (in words): {convertToCurrencyWords(total)}
        </Text>

        <Text style={[styles.bold, { marginTop: 10 }]}>
          Terms / Declaration
        </Text>
        <Text style={styles.footerText}>
          This is a system-generated proforma invoice and does not require
          signature or seal.
        </Text>

        {/* ✅ Bank Details + Signature Row */}
        <View style={styles.bankRow}>
          {/* Bank Details Left */}
          <View style={{ flex: 1 }}>
            <Text style={[styles.bold]}>Bank Details</Text>
            <Text>Bank Name: ICICI Bank</Text>
            <Text>Account No.: 72305000377</Text>
            <Text>Branch & IFSC: ICIC0007235</Text>
          </View>

          {/* Signature Right */}
          <Image src={signatureImg} style={styles.signature} />
        </View>

        <Text style={[styles.right, { marginTop: 4 }]}>
          For, Legal Papers India
        </Text>

        <Text style={styles.powered}>Powered by Hitech BillSoft</Text>
      </Page>
    </Document>
  );
};

export default GeneratePerformaPDF;
