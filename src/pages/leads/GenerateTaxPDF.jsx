import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import logo from "../../assets/legalpapers.png";
import signatureImg from "../../assets/LPISignature.png";
import bgImage from "../../assets/LPIBG.png";
import qrCodeImg from "../../assets/LegalPapersQR.png";
import { toWords } from "number-to-words";
import Unifont from "../../assets/fonts/unifont.otf";

const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  const options = {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options);
};

Font.register({
  family: "Unifont",
  src: Unifont,
});
// Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#000",
    position: "relative", // required for absolutely-positioned background
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  logo: { fontSize: 14, color: "#007bff", fontWeight: "bold" },
  heading: {
    textAlign: "right",
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
  },
  goldenLine: {
    height: 3,
    backgroundColor: "#007bff",
    marginTop: 6,
    marginBottom: 10,
    borderRadius: 2,
  },
  topRight: { textAlign: "right", fontSize: 9, marginTop: 2 },
  blueLabel: {
    backgroundColor: "#007bff",
    color: "white",
    paddingVertical: 3,
    paddingHorizontal: 3,
    fontWeight: "bold",
    fontSize: 10,
    marginBottom: 4,
  },
  box: {
    padding: 2,
    fontSize: 10,
    // marginBottom: 6,
    lineHeight: 1.5,
  },
  bold: { fontWeight: "bold" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    color: "white",
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 3,
    fontSize: 9,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 3,
    borderBottom: "1px solid #FFC300",
    fontSize: 9,
  },
  cell: { flex: 1, paddingHorizontal: 3 },
  textAlign: { textAlign: "center" },
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taxSummaryHeader: {
    flexDirection: "row",
    color: "black",
    fontWeight: "bold",
    fontSize: 9,
    padding: 4,
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
    paddingVertical: 4,
    paddingHorizontal: 1,
    fontSize: 11,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    marginTop: "auto",
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
  footerText: { fontSize: 10, marginTop: 12 },
  bankRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 4,
  },

  signature: {
    width: 100,
    height: 50,
    objectFit: "contain",
    marginBottom: 2,
  },

  rightText: {
    textAlign: "right",
    fontSize: 10,
    marginTop: 4,
  },

  powered: {
    fontSize: 7,
    color: "gray",
    marginTop: 0,
    textAlign: "right",
  },
});

const GenerateTaxPDF = ({ formData, invoiceNo = 1 }) => {
  const {
    name,
    address,
    gstNo,
    mobileNumber,
    date,
    validUntil,
    taxType,
    selectedServiceData = [],
    paidAmount = 2000,
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
  const balanceAmount = total - paidAmount;

  const convertToWords = (num) => {
    return toWords(num).replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const convertToCurrencyWords = (num) => {
    const integerPart = Math.floor(num);
    const decimalPart = Math.round((num - integerPart) * 100);
    const integerWords = convertToWords(integerPart);

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
        <Image
          src={bgImage}
          style={styles.backgroundImage}
          fixed
          wrap={false}
        />
        {/* Header */}
        <View style={styles.row}>
          <Image src={logo} style={{ width: 140, height: "auto" }} />

          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={{ fontSize: 10, marginBottom: 3 }}>
              (Original Copy)
            </Text>
            <Text style={styles.heading}>INVOICE GST - {invoiceNo}</Text>
            <Text style={styles.topRight}>
              <Text style={styles.bold}>Date:</Text> {formatDate(date)}
            </Text>
          </View>
        </View>

        {/* Golden Line Under Header */}
        <View style={styles.goldenLine} />

        {/* Buyer/Seller Info */}
        <View style={[styles.row, { marginTop: 16 }]}>
          {/* LEFT BOX: Legal Papers India */}
          <View
            style={{
              width: "58%",
              padding: 6,
              marginRight: 6,
              lineHeight: 1,
            }}
          >
            <Text style={[styles.bold, { fontSize: 11 }]}>
              Legal Papers India
            </Text>
            <Text>B-768, Street 8, Mukandpur, New Delhi 110042</Text>
            <Text>Contact: 9315247392</Text>
            <Text>Email: info@legalpapersindia.com</Text>
            <Text>Website: www.legalpapersindia.com</Text>
            <Text>GSTIN: 07BRPPB7333A1Z3</Text>
          </View>

          {/* RIGHT BOX: Bill To */}
          <View
            style={{
              width: "40%",
              padding: 6,
            }}
          >
            <Text style={styles.blueLabel}>Bill To:</Text>
            <View style={styles.box}>
              <Text style={[styles.bold, { lineHeight: 1 }]}>{name}</Text>
              <Text style={{ lineHeight: 1 }}>{address}</Text>
              <Text style={{ lineHeight: 1 }}>
                Contact: {mobileNumber || "-"}
              </Text>
              <Text style={{ lineHeight: 1 }}>PoS: 33-Tamil Nadu</Text>
              <Text style={{ lineHeight: 1 }}>GSTIN: {gstNo || "-"}</Text>
            </View>
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, { flex: 0.5 }]}>S.No</Text>
          <Text style={[styles.cell, styles.textAlign]}>Particulars</Text>
          <Text style={[styles.cell, styles.textAlign]}>HSN/SAC</Text>
          <Text style={[styles.cell, styles.textAlign]}>Qty</Text>
          <Text style={[styles.cell, styles.textAlign]}>Unit Price</Text>
          <Text style={[styles.cell, styles.textAlign]}>GST%</Text>
          <Text style={[styles.cell, styles.rightAlign]}>Amount</Text>
        </View>

        {/* Table Rows */}
        {selectedServiceData.map((item, i) => {
          const amount = item.price * item.quantity;
          const gstPercent = Number(item.taxPercent || 0);
          const gstRate = taxType === "intra" ? gstPercent / 2 : gstPercent;

          // Alternate row color
          const rowBackground = i % 2 === 0 ? "#FFFFFF" : "#FFECB3"; // Even = white, Odd = light golden

          return (
            <View
              key={i}
              style={[styles.tableRow, { backgroundColor: rowBackground }]}
            >
              <Text style={[styles.cell, { flex: 0.5 }]}>{i + 1}</Text>
              <Text style={[styles.cell, styles.textAlign]}>{item.name}</Text>
              <Text style={[styles.cell, styles.textAlign]}>
                {item.hsnCode}
              </Text>
              <Text style={[styles.cell, styles.textAlign]}>
                {item.quantity}
              </Text>
              <Text style={[styles.cell, styles.textAlign]}>
                <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>₹</Text>
                {item.price.toFixed(2)}
              </Text>
              <Text style={[styles.cell, styles.textAlign]}>
                {gstRate.toFixed(0)}%
              </Text>
              <Text style={[styles.cell, styles.rightAlign]}>
                <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>₹</Text>
                {amount.toFixed(2)}
              </Text>
            </View>
          );
        })}

        {/* Quantity Summary */}
        <View style={styles.qtyBox}>
          <Text>Total Qty: {totalQty}</Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "38%",
            }}
          >
            <Text>Total Amount:</Text>
            <Text>
              <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>₹</Text>
              {total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* HSN + Total Section */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          {/* HSN/SAC Tax Summary - LEFT SIDE */}
          <View style={{ width: "60%" }}>
            <View style={styles.taxSummaryHeader}>
              <Text style={[styles.cell, { flex: 1 }]}>HSN/SAC</Text>
              <Text style={[styles.cell, { flex: 1 }]}>GST%</Text>
              <Text style={[styles.cell, { flex: 1 }]}>Amount</Text>
              {taxType === "intra" ? (
                <>
                  <Text style={[styles.cell, { flex: 1 }]}>CGST</Text>
                  <Text style={[styles.cell, { flex: 1 }]}>SGST</Text>
                </>
              ) : (
                <Text style={[styles.cell, { flex: 2 }]}>IGST</Text>
              )}
            </View>

            {Object.entries(hsnWiseSummary).map(([hsn, data], i) => {
              const gst = data.gstPercent;
              const half = taxType === "intra" ? (data.amount * gst) / 200 : 0;
              const displayRate = taxType === "intra" ? gst / 2 : gst;

              return (
                <View style={styles.taxSummaryRow} key={i}>
                  <Text style={[styles.cell, { flex: 1, textAlign: "left" }]}>
                    {hsn}
                  </Text>
                  <Text style={[styles.cell, { flex: 1 }]}>
                    {displayRate.toFixed(0)}%
                  </Text>
                  <Text style={[styles.cell, { flex: 1 }]}>
                    <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>
                      ₹
                    </Text>
                    {data.amount.toFixed(2)}
                  </Text>
                  {taxType === "intra" ? (
                    <>
                      <Text style={[styles.cell, { flex: 1 }]}>
                        <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>
                          ₹
                        </Text>
                        {half.toFixed(2)}
                      </Text>
                      <Text style={[styles.cell, { flex: 1 }]}>
                        <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>
                          ₹
                        </Text>
                        {half.toFixed(2)}
                      </Text>
                    </>
                  ) : (
                    <Text style={[styles.cell, { flex: 2 }]}>
                      <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>
                        ₹
                      </Text>
                      {((data.amount * gst) / 100).toFixed(2)}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>

          {/* TOTAL BOX - RIGHT SIDE */}
          <View style={{ width: "40%", paddingLeft: 10 }}>
            <View style={styles.summaryRow}>
              <Text>Sub Total</Text>
              <Text>
                <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>₹</Text>
                {subTotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Tax Amount (+)</Text>
              <Text>
                <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>₹</Text>
                {(cgst + sgst + igst).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer: Amount in words (left) + Total Amount (right) */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
            marginBottom: 10,
            gap: 20,
          }}
        >
          {/* Left side - Amount in words */}
          <View style={{ width: "50%", paddingLeft: 5 }}>
            <Text style={styles.footerText}>
              Amount (in words): {convertToCurrencyWords(total)}
            </Text>
          </View>

          {/* Right side - Total Amount Box */}
          <View style={[styles.totalAmountBox, { width: "38%" }]}>
            <Text style={styles.totalAmountLabel}>TOTAL AMOUNT</Text>
            <Text style={styles.totalAmountValue}>
              <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>₹</Text>
              {total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Golden Line Under Terms */}
        <View style={styles.goldenLine} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            marginTop: 10,
          }}
        >
          {/* Left: Terms / Declaration */}
          <View style={{ width: "60%" }}>
            <Text style={[styles.bold, { marginBottom: 4 }]}>
              Terms / Declaration
            </Text>
            <Text style={styles.footerText}>
              This is a system-generated proforma invoice{`\n`}
              and does not require signature or seal.
            </Text>
          </View>

          {/* Right: Amount Summary */}
          <View style={{ width: "38%" }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.bold}>Amount Paid:</Text>
              <Text>
                <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>₹</Text>
                {paidAmount.toFixed(2)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 4,
              }}
            >
              <Text style={styles.bold}>Balance:</Text>
              <Text>
                <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>₹</Text>
                {balanceAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* QR Code above bank and signature row */}
        <View style={{ alignItems: "flex-start", marginTop: 10 }}>
          <Image src={qrCodeImg} style={{ width: 80, height: "auto" }} />
        </View>

        {/* Bank details row with signature in right section */}
        <View style={styles.bankRow}>
          {/* Left side - Bank details */}
          <View style={{ flex: 1 }}>
            <Text style={styles.bold}>Bank Details</Text>
            <Text>Bank Name: ICICI Bank</Text>
            <Text>Account No.: 72305000377</Text>
            <Text>Branch & IFSC: ICIC0007235</Text>
          </View>

          {/* Right side - For Legal Papers + Signature */}
          <View style={{ alignItems: "flex-end" }}>
            <Image src={signatureImg} style={styles.signature} />
            <Text style={styles.rightText}>For, Legal Papers India</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default GenerateTaxPDF;
