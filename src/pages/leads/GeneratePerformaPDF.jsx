import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../../assets/legalpapers.png";
import signatureImg from "../../assets/LPISignature.png";
import bgImage from "../../assets/LPIBG.png";
import qrCodeImg from "../../assets/legalpapersindia.png";
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
  page: {
    // padding: 30,
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
    marginTop: 6,
    marginBottom: 0,
    borderRadius: 2,
  },
  goldenLine1: {
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
    marginBottom: 0,
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
    paddingVertical: 5,
    paddingHorizontal: 3,
    fontSize: 9,
    marginTop: 0,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 3,
    borderBottom: "1px solid #FFC300",
    fontSize: 9,
  },
  cell: { flex: 1, paddingHorizontal: 3 },
  // rightAlign: { textAlign: "right" },
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
  footerText: { fontSize: 10 },
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

const GeneratePerformaPDF = ({ formData, invoiceNo = 100 }) => {
  const {
    name,
    address,
    addressDropdown,
    gstNo,
    mobileNumber,
    date,
    validUntil,
    taxType,
    services = [],
    // selectedServiceData: services = [],
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

  // Updated section in GeneratePerformaPDF.jsx

  let cgst = 0,
    sgst = 0,
    igst = 0,
    subTotal = 0;
  const hsnWiseSummary = {};
  let totalQty = 0;

  // ✅ Calculate subtotal first
  services.forEach((item) => {
    const amount = item.price * item.quantity;
    totalQty += Number(item.quantity || 0);
    subTotal += amount;

    const hsn = item.hsnCode || "N/A";
    const gstPercent = Number(item.taxPercent || 18);

    if (!hsnWiseSummary[hsn]) {
      hsnWiseSummary[hsn] = { amount: 0, gstPercent };
    }
    hsnWiseSummary[hsn].amount += amount;
  });

  // ✅ Apply discount to get net amount
  const discountAmount = Number(discount || 0);
  const netAmount = subTotal - discountAmount;

  // ✅ Calculate GST on NET AMOUNT (after discount)
  Object.entries(hsnWiseSummary).forEach(([hsn, data]) => {
    // Calculate proportional net amount for this HSN after discount
    const hsnDiscountAmount = (data.amount / subTotal) * discountAmount;
    const hsnNetAmount = data.amount - hsnDiscountAmount;
    const gstPercent = data.gstPercent;

    if (taxType === "intra") {
      const halfRate = gstPercent / 2;
      cgst += (hsnNetAmount * halfRate) / 100;
      sgst += (hsnNetAmount * halfRate) / 100;
    } else {
      igst += (hsnNetAmount * gstPercent) / 100;
    }
  });

  const totalTax = cgst + sgst + igst;
  const grandTotal = netAmount + totalTax;

  // ✅ Updated HSN summary calculation for display
  const updatedHsnSummary = {};
  Object.entries(hsnWiseSummary).forEach(([hsn, data]) => {
    const hsnDiscountAmount = (data.amount / subTotal) * discountAmount;
    const hsnNetAmount = data.amount - hsnDiscountAmount;

    updatedHsnSummary[hsn] = {
      originalAmount: data.amount,
      netAmount: hsnNetAmount,
      gstPercent: data.gstPercent,
    };
  });

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
        <Image
          src={bgImage}
          style={styles.backgroundImage}
          fixed
          wrap={false}
        />
        {/* Header */}
        <View style={styles.row}>
          <Image src={logo} style={{ width: 140, height: "auto" }} />

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

        {/* Golden Line Under Header */}
        <View style={styles.goldenLine} />

        {/* Buyer/Seller Info */}
        <View style={[styles.row, { marginTop: 0 }]}>
          {/* LEFT BOX: Legal Papers India */}
          <View
            style={{
              width: "58%",
              padding: 6,
              marginRight: 6,
              lineHeight: 0.7,
            }}
          >
            {/* <Text style={[styles.bold, { fontSize: 11 }]}>
              Legal Papers India
            </Text> */}

            {/* Show addressDropdown if available, otherwise show default address */}
            {formData.addressDropdown ? (
              renderFormattedDescription(formData.addressDropdown)
            ) : (
              <Text>B-768, Street 8, Mukandpur, New Delhi 110042</Text>
            )}

            {/* <Text>Contact: 9315247392</Text>
            <Text>Email: info@legalpapersindia.com</Text>
            <Text>Website: www.legalpapersindia.com</Text>
            <Text>GSTIN: 07BRPPB7333A1Z3</Text> */}
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
          <Text style={styles.cell}>Particulars</Text>
          <Text style={styles.cell}>HSN/SAC</Text>
          <Text style={styles.cell}>Qty</Text>
          <Text style={[styles.cell, styles.rightAlign]}>Unit Price</Text>
          <Text style={[styles.cell, styles.rightAlign]}>GST%</Text>
          <Text style={[styles.cell, styles.rightAlign]}>Amount</Text>
        </View>

        {services.map((item, i) => {
          const price = Number(item.price) || 0; // <-- convert to number
          const quantity = Number(item.quantity) || 0;
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
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cell}>{item.hsnCode}</Text>
              <Text style={styles.cell}>{quantity}</Text>
              <Text style={[styles.cell, styles.rightAlign]}>
                <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>₹</Text>
                {price.toFixed(2)}
              </Text>
              <Text style={[styles.cell, styles.rightAlign]}>
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
            <Text>Sub Total</Text>
            <Text>
              <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>₹</Text>
              {subTotal.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* HSN + Total Section */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          {/* HSN/SAC Tax Summary - LEFT SIDE */}
          <View style={{ width: "60%" }}>
            <View style={styles.taxSummaryHeader}>
              <Text style={[styles.cell, { flex: 1 }]}>HSN/SAC</Text>
              <Text style={[styles.cell, { flex: 1 }]}>GST%</Text>
              <Text style={[styles.cell, { flex: 1 }]}>Net Amount</Text>
              {taxType === "intra" ? (
                <>
                  <Text style={[styles.cell, { flex: 1 }]}>CGST</Text>
                  <Text style={[styles.cell, { flex: 1 }]}>SGST</Text>
                </>
              ) : (
                <Text style={[styles.cell, { flex: 2 }]}>IGST</Text>
              )}
            </View>

            {Object.entries(updatedHsnSummary).map(([hsn, data], i) => {
              const gst = data.gstPercent;
              const netAmount = data.netAmount;
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
                    {netAmount.toFixed(2)}
                  </Text>
                  {taxType === "intra" ? (
                    <>
                      <Text style={[styles.cell, { flex: 1 }]}>
                        <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>
                          ₹
                        </Text>
                        {((netAmount * gst) / 200).toFixed(2)}
                      </Text>
                      <Text style={[styles.cell, { flex: 1 }]}>
                        <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>
                          ₹
                        </Text>
                        {((netAmount * gst) / 200).toFixed(2)}
                      </Text>
                    </>
                  ) : (
                    <Text style={[styles.cell, { flex: 2 }]}>
                      <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>
                        ₹
                      </Text>
                      {((netAmount * gst) / 100).toFixed(2)}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>

          {/* TOTAL BOX - RIGHT SIDE */}
          <View style={{ width: "40%", paddingLeft: 10 }}>
            {/* Sub Total */}
            {/* <View style={styles.summaryRow}>
              <Text>Sub Total</Text>
              <Text>
                <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>₹</Text>
                {subTotal.toFixed(2)}
              </Text>
            </View> */}

            {/* Discount & Net Amount - show only if discount exists */}
            {Number(discount || 0) > 0 && (
              <>
                <View style={styles.summaryRow}>
                  <Text>Discount (-)</Text>
                  <Text>
                    <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>
                      ₹
                    </Text>
                    {Number(discount).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text>Net Amount</Text>
                  <Text>
                    <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>
                      ₹
                    </Text>
                    {netAmount.toFixed(2)}
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

            {/* ✅ ROUND OFF - हमेशा दिखाएं */}
            {(() => {
              const totalBeforeRounding = netAmount + cgst + sgst + igst;
              const roundedTotal = Math.round(totalBeforeRounding);
              const roundOffAmount = roundedTotal - totalBeforeRounding;

              return (
                <View style={styles.summaryRow}>
                  <Text>Round Off ({roundOffAmount >= 0 ? "+" : "-"})</Text>
                  <Text>
                    <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>
                      ₹
                    </Text>
                    {Math.abs(roundOffAmount).toFixed(2)}
                  </Text>
                </View>
              );
            })()}

            {/* GRAND TOTAL */}
            {/* <View
              style={[
                styles.summaryRow,
                { borderTop: "1px solid #000", marginTop: 4, paddingTop: 2 },
              ]}
            >
              <Text style={{ fontWeight: "bold" }}>Grand Total</Text>
              <Text style={{ fontWeight: "bold" }}>
                <Text style={{ fontFamily: "Unifont", fontSize: 10 }}>₹</Text>
                {Math.round(grandTotal).toFixed(2)}
              </Text>
            </View> */}
          </View>
        </View>

        {/* Footer: Amount in words (left) + Total Amount (right) */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 2,
            // gap: 20,
          }}
        >
          {/* Left side - Amount in words */}
          <View style={{ width: "50%", paddingLeft: 5 }}>
            <Text style={styles.footerText}>
              Amount (in words):{" "}
              {convertToCurrencyWords(Math.round(grandTotal))}
            </Text>
          </View>

          {/* Right side - Total Amount Box */}
          <View style={[styles.totalAmountBox, { width: "38%" }]}>
            <Text style={styles.totalAmountLabel}>GRAND TOTAL AMOUNT</Text>
            <Text style={styles.totalAmountValue}>
              {Math.round(grandTotal).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Golden Line Under Terms */}
        <View style={styles.goldenLine1} />

        <View>
          <Text style={[styles.bold, { marginBottom: 2 }]}>
            Terms / Declaration
          </Text>
        </View>

        <View>{renderFormattedDescription(termsAndConditions)}</View>

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
          <View
            style={{
              width: "50%",
              alignItems: "flex-end",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontStyle: "italic",
                fontWeight: "bold",
                marginBottom: 6,
                marginRight: 12,
                textAlign: "center",
                color: "#333",
              }}
            >
              Pay Here
            </Text>

            <Image src={qrCodeImg} style={{ width: 90, height: 90 }} />

            <Text
              style={{
                fontSize: 8,
                marginTop: 8,
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Merchant Name: </Text>
              Legal Papers India
            </Text>
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

export default GeneratePerformaPDF;
