import jsPDF from "jspdf";
import QRCode from "qrcode";
import { api } from "../api/axiosInstance";
import { headers } from "../constant";
import { toast } from "react-toastify";

export const downloadTicketPDF = async (orderId) => {
  try {
    // 1. Fetch order details
    const res = await api.get(`/orders/${orderId}`, { headers });
    const order = res.data;

    if (!order) throw new Error("Order not found");

    const { showtime, seatData, totalPrice } = order;
    const movie = showtime?.movie?.name || "Unknown Movie";
    const theater = showtime?.screen?.theaterName || "Screen X";
    const start = new Date(showtime?.startTime);

    const date = start.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const time = start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const seats = (seatData?.seats || [])
      .map((s) => `${s.row}${s.column} (${s.layoutType})`)
      .join(", ");

    // 2. PDF setup
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [400, 500],
    });

    // Background dark
    doc.setFillColor("#111827"); // dark gray/black
    doc.rect(0, 0, 400, 600, "F");

    // --- Add Logo from public folder ---
    const logo = "/movie_logo.png"; // ✅ Public folder access
    const img = new Image();
    img.src = logo;
    await new Promise((resolve) => {
      img.onload = () => {
        doc.addImage(img, "PNG", 150, 15, 100, 40); // centered top logo
        resolve(true);
      };
    });

    // Title under logo
    doc.setTextColor("#3B82F6"); // bright blue
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CINEMA PASS", 200, 70, { align: "center" });

    // Vertical divider line (like ticket cut)
    doc.setDrawColor("#374151");
    doc.setLineWidth(1);
    doc.line(50, 15, 50, 250);
    doc.line(350, 15, 350, 250);

    // Left side (date/time vertical)
    doc.setFontSize(14);
    doc.setTextColor("#D1D5DB");
    doc.text(`${date}, ${time}`, 20, 180, { angle: 90 });

    // Middle section (Movie, Theater, Seats, Price)
    let currentY = 150; // start Y for content

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor("#3B82F6");
    doc.text(movie.toUpperCase(), 200, currentY, { align: "center" });
    currentY += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor("#E5E7EB");
    doc.text(`Theater: ${theater}`, 200, currentY, { align: "center" });
    currentY += 20;

    // Seats (wrapped with splitTextToSize)
    const maxWidth = 280;
    const seatLines = doc.splitTextToSize(`Seats: ${seats}`, maxWidth);
    doc.text(seatLines, 200, currentY, { align: "center" });
    currentY += seatLines.length * 15; // push down based on lines

    doc.setFontSize(14);
    doc.setTextColor("#3B82F6");
    doc.text(`TOTAL: ${totalPrice}rs`, 200, currentY, { align: "center" });
    currentY += 30;

    // Blue line separator above terms
    doc.setDrawColor("#3B82F6");
    doc.setLineWidth(0.7);
    doc.line(50, currentY, 350, currentY);
    currentY += 10;

    // Terms & Conditions
    doc.setFontSize(10);
    doc.setTextColor("#9CA3AF");
    doc.text(
      "Terms & Conditions:\nNon-refundable. Valid for date/time shown.\nNo outside food/drink allowed.",
      200,
      currentY + 10,
      { align: "center" }
    );

    // QR Code
    const qrText = `Ticket scanned: OrderID ${orderId}\nYou can enter the theater.`;
    const qrData = await QRCode.toDataURL(qrText);
    doc.addImage(qrData, "PNG", 140, 310, 120, 120);
    doc.setFontSize(10);
    doc.setTextColor("#9CA3AF");
    doc.text("SCAN AT ENTRANCE", 200, 460, { align: "center" });

    // Save
    doc.save(`${movie}_ticket.pdf`);
    toast.success("Ticket downloaded!");
  } catch (error) {
    console.error(error);
    toast.error("Failed to download ticket");
  }
};
