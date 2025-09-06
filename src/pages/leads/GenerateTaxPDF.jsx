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
    paddingVertical: 10,
    paddingHorizontal: 30,
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
    marginTop: 1,
    marginBottom: 1,
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
    marginTop: 1,
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
  taxSummaryRow: {
    flexDirection: "row",
    fontSize: 9,
    padding: 4,
    marginBottom: 0,
  },
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
  label: {
    fontWeight: "bold",
  },

  detailText: {
    fontSize: 10,
    lineHeight: 1,
    marginBottom: 6,
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
    services = [],
    // selectedServiceData: services = [],
    paidAmount = 0,
    termsAndConditions,
    discount,
  } = formData;

  const renderFormattedDescription = (html) => {
    if (!html) return null;

    const output = [];
    let index = 0;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const walk = (node, parentStyle = {}) => {
      const elements = [];

      if (node.nodeType === 3) {
        const text = node.nodeValue;
        if (text.trim()) {
          elements.push(
            <Text key={`text-${index++}`} style={parentStyle}>
              {decodeEntities(text)}
            </Text>
          );
        }
      } else if (node.nodeType === 1) {
        const tag = node.nodeName.toLowerCase();
        let style = { ...parentStyle };

        // Basic tag styles
        if (tag === "strong" || tag === "b") style.fontWeight = "bold";
        if (tag === "em" || tag === "i") style.fontStyle = "italic";
        if (tag === "u") style.textDecoration = "underline";

        if (tag === "br") {
          elements.push(<Text key={`br-${index++}`}>{"\n"}</Text>);
          return elements;
        }

        if (tag === "p" || tag === "div") {
          const children = [];
          node.childNodes.forEach((child) => {
            children.push(...walk(child, style));
          });
          elements.push(
            <Text key={`p-${index++}`} style={{ marginBottom: 4, ...style }}>
              {children}
            </Text>
          );
          return elements;
        }

        if (tag === "ul" || tag === "ol") {
          const isOrdered = tag === "ol";
          let counter = 1;

          Array.from(node.children).forEach((li) => {
            if (li.nodeName.toLowerCase() === "li") {
              const liChildren = walk(li, style);
              const prefix = isOrdered ? `${counter++}. ` : "• ";
              elements.push(
                <Text
                  key={`li-${index++}`}
                  style={{ marginLeft: 10, ...style }}
                >
                  {prefix}
                  {liChildren}
                </Text>
              );
            }
          });
          return elements;
        }

        if (tag === "li") {
          const children = [];
          node.childNodes.forEach((child) => {
            children.push(...walk(child, style));
          });
          elements.push(
            <Text key={`li-${index++}`} style={{ marginLeft: 10, ...style }}>
              {children}
            </Text>
          );
          return elements;
        }

        // Any other nested tags
        node.childNodes.forEach((child) => {
          elements.push(...walk(child, style));
        });
      }

      return elements;
    };

    doc.body.childNodes.forEach((node) => {
      output.push(...walk(node));
    });

    return output;
  };

  const decodeEntities = (html) => {
    return html
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  };

  let cgst = 0,
    sgst = 0,
    igst = 0,
    subTotal = 0;
  const hsnWiseSummary = {};
  let totalQty = 0;

  services.forEach((item) => {
    const amount = item.price * item.quantity;
    const gstPercent = Number(item.taxPercent || 18);
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

  const netAmount = subTotal - Number(discount || 0);
  const grandTotal = netAmount + cgst + sgst + igst;
  // const balanceAmount = total - paidAmount;

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
            <Text style={styles.heading}>TAX INVOICE - {invoiceNo}</Text>
            <Text style={styles.topRight}>
              <Text style={styles.bold}>Date:</Text> {formatDate(date)}
            </Text>
          </View>
        </View>

        {/* Golden Line Under Header */}
        <View style={styles.goldenLine} />

        {/* Buyer/Seller Info */}
        <View style={[styles.row]}>
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
              {/* <Text style={{ lineHeight: 1 }}>{address}</Text> */}
              {renderFormattedDescription(address)}
              <Text style={{ lineHeight: 1 }}>
                Contact: {mobileNumber || "-"}
              </Text>
              {/* <Text style={{ lineHeight: 1 }}>PoS: 33-Tamil Nadu</Text> */}
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
        {services.map((item, i) => {
          const price = Number(item.price) || 0; // Ensure number
          const quantity = Number(item.quantity) || 1; // Ensure number
          const amount = price * quantity;
          const gstPercent = Number(item.taxPercent || 18);
          // const gstRate = taxType === "intra" ? gstPercent / 2 : gstPercent;
          const gstRate = 18;

          // Alternate row color
          const rowBackground = i % 2 === 0 ? "#FFFFFF" : "#FFECB3"; // Even = white, Odd = light golden

          return (
            <View
              key={i}
              style={[styles.tableRow, { backgroundColor: rowBackground }]}
            >
              <Text style={[styles.cell, { flex: 0.5 }]}>{i + 1}</Text>
              <Text style={[styles.cell, styles.textAlign]}>
                {item.name || "-"}
              </Text>
              <Text style={[styles.cell, styles.textAlign]}>
                {item.hsnCode || "-"}
              </Text>
              <Text style={[styles.cell, styles.textAlign]}>{quantity}</Text>
              <Text style={[styles.cell, styles.textAlign]}>
                <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>₹</Text>
                {price.toFixed(2)}
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
              {grandTotal.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* HSN + Total Section */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 0,
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
            {/* Sub Total */}
            <View style={styles.summaryRow}>
              <Text>Sub Total</Text>
              <Text>
                <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>₹</Text>
                {subTotal.toFixed(2)}
              </Text>
            </View>

            {/* Discount & Net Amount - show only if discount exists */}
            {Number(discount || 0) > 0 && (
              <>
                {/* Discount */}
                <View style={styles.summaryRow}>
                  <Text>Discount (-)</Text>
                  <Text>
                    <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>
                      ₹
                    </Text>
                    {Number(discount).toFixed(2)}
                  </Text>
                </View>

                {/* Net Amount */}
                <View style={styles.summaryRow}>
                  <Text>Net Amount</Text>
                  <Text>
                    <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>
                      ₹
                    </Text>
                    {(subTotal - Number(discount)).toFixed(2)}
                  </Text>
                </View>
              </>
            )}

            {/* Tax Amount */}
            <View style={styles.summaryRow}>
              <Text>Tax Amount (+)</Text>
              <Text>
                <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>₹</Text>
                {(cgst + sgst + igst).toFixed(2)}
              </Text>
            </View>

            {/* GRAND TOTAL */}
            <View
              style={[
                styles.summaryRow,
                { borderTop: "1px solid #000", marginTop: 4, paddingTop: 2 },
              ]}
            >
              <Text style={{ fontWeight: "bold" }}>Grand Total</Text>
              <Text style={{ fontWeight: "bold" }}>
                <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>₹</Text>
                {grandTotal.toFixed(2)}
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
            marginTop: 2,
            marginBottom: 2,
          }}
        >
          {/* Left side - Amount in words */}
          <View style={{ flex: 1, paddingRight: 20 }}>
            <Text style={styles.footerText}>
              Amount (in words): {convertToCurrencyWords(grandTotal)}
            </Text>
          </View>

          {/* Right side - Total Amount Box */}
          <View style={{ width: "38%" }}>
            <View style={styles.totalAmountBox}>
              <Text style={styles.totalAmountLabel}>GRAND TOTAL AMOUNT</Text>
              <Text style={styles.totalAmountValue}>
                <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>₹</Text>
                {grandTotal.toFixed(2)}
              </Text>
            </View>
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
            <View>{renderFormattedDescription(termsAndConditions)}</View>
          </View>

          {/* Right: Amount Summary */}
          <View style={{ width: "38%" }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.bold}>Amount Paid:</Text>
              <Text>
                <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>₹</Text>
                {grandTotal.toFixed(2)}
                {/* {paidAmount.toFixed(2)} */}
              </Text>
            </View>

            {/* <View
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
            </View> */}
          </View>
        </View>

        {/* First row: QR + Bank Details */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          {/* Bank Details */}
          <View style={{ width: "50%" }}>
            <Text style={[styles.bold, { marginBottom: 5, fontSize: 12 }]}>
              Bank Details
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Bank Name: </Text>ICICI Bank
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Account Holder: </Text>Legal Papers
              India
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Account Number: </Text>723505000377
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>IFSC Code: </Text>ICIC0007235
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Branch: </Text>ICICI BANK LTD., BG-221,
              SANJAY GANDHI TRANSPORT NAGAR, DELHI - 110042
            </Text>
          </View>

          {/* QR */}
          <View style={{ width: "50%", alignItems: "flex-end" }}>
            <Image src={qrCodeImg} style={{ width: 80, height: "auto" }} />
          </View>
        </View>

        {/* Second row: UPI Payment + Signature */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          {/* UPI Payment */}
          <View style={{ width: "65%" }}>
            <Text style={[styles.bold, { marginBottom: 5, fontSize: 12 }]}>
              UPI Payment
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Company Name: </Text>LEGAL PAPERS INDIA
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>UPI ID: </Text>Legalpapersindia@icici
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.label}>Payment Link: </Text>
              https://legalpapersindia.com/phonepay.php
            </Text>
          </View>

          {/* Signature */}
          <View style={{ width: "30%", alignItems: "flex-end" }}>
            <Image src={signatureImg} style={styles.signature} />
            <Text style={styles.rightText}>For, Legal Papers India</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default GenerateTaxPDF;
