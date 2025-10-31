import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showSnackbar } from "@/store/slices/snackbarSlice";
import { InCheckoutModel } from "@/types";
import { BasketBody } from "@/types/basketModel";
import React from "react";
import {
    Linking,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";


interface InvoicePreviewModalProps {
    visible: boolean;
    onClose: () => void;
    totalAmount: string;
    paymentMethod: string;
    deliveryAddress: string;
    basketDetails: BasketBody;
    checkoutModel: InCheckoutModel;
}

const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
    visible,
    onClose,
    totalAmount,
    paymentMethod,
    deliveryAddress,
    basketDetails,
    checkoutModel,
}) => {
    const dispatch = useAppDispatch();
    const companyModel = useAppSelector((state) => state.company.companyModel);
    const userProfile = useAppSelector((state) => state.auth.userProfile);
    let items = basketDetails.basket;

    const sendViaWhatsApp = () => {
        try {

            // Build formatted message
            let message = `📦 *${companyModel?.ioe_storename}*\n${companyModel?.cmp_address}\n`;
            message += `📞 *${companyModel?.cmp_phone}*\n\n`;

            message += `🧾 *Invoice for:* ${userProfile?.ireg_firstname} ${userProfile?.ireg_lastname}\n`;
            message += `✉️ *Email:* ${userProfile?.ireg_email}\n`;
            message += `📱 *Phone:* ${userProfile?.ireg_phone1 ?? userProfile?.ireg_phone2 ?? ""}\n\n`;

            message += `🛍️ *Items:*\n`;

            items.forEach((item: any, index: number) => {
                message += `${index + 1}. ${item.it_name} - Qty: ${item.amount} - $${item.it_unitprice} = $${item.amount * item.it_unitprice}\n`;
            });

            message += `\n💳 *Payment Method:* ${paymentMethod}\n`;
            message += `💰 *Total:* ${totalAmount} ${companyModel?.cur_newcode}\n`;

            // Encode for WhatsApp
            const encodedMessage = encodeURIComponent(message);

            // Format phone number
            const phone = companyModel?.cmp_phone.replace("+", "").replace(/\s/g, "");

            const url = `https://wa.me/${phone}?text=${encodedMessage}`;

            Linking.canOpenURL(url)
                .then((supported) => {
                    if (supported) {
                        Linking.openURL(url);
                    } else {
                        dispatch(showSnackbar({ message: "WhatsApp is not installed on this device.", isError: true }));
                    }
                })
                .catch((err) => {
                    console.error("Error opening WhatsApp:", err);
                    dispatch(showSnackbar({ message: "Could not open WhatsApp", isError: true }));
                });
        } catch (error) {
            console.error("sendViaWhatsApp error:", error);
            dispatch(showSnackbar({ message: "Something went wrong while sending via WhatsApp.", isError: true }));
        }
    };

    const sendViaEmail = () => {
        try {
            const toEmail = companyModel?.cmp_email || "";
            const subject = `Invoice from ${companyModel?.ioe_storename || "My Store"}`;


            // Build invoice text
            let body = `${companyModel?.ioe_storename || ""}\n${companyModel?.cmp_address || ""}\n${companyModel?.cmp_phone || ""}\n\n`;
            body += `Invoice for: ${userProfile?.ireg_firstname} ${userProfile?.ireg_lastname}\n`;
            body += `Email: ${userProfile?.ireg_email || "N/A"}\n`;
            body += `Payment Method: ${userProfile?.ireg_phone1 || userProfile?.ireg_phone2 || "N/A"}\n\n`;
            body += `Items:\n`;

            basketDetails.basket.forEach((item, index) => {
                body += `${index + 1}. ${item.iba_it_name} - Qty: ${item.iba_qty} - $${item.iba_price} = $${item.iba_total}\n`;
            });

            body += `\nTotal: $${totalAmount} ${companyModel?.cur_newcode || ""}\n`;

            // Encode the subject and body for URL
            const encodedSubject = encodeURIComponent(subject);
            const encodedBody = encodeURIComponent(body);

            // Build the mailto link
            const mailtoLink = `mailto:${toEmail}?subject=${encodedSubject}&body=${encodedBody}`;

            // Open in the default mail app
            Linking.canOpenURL(mailtoLink)
                .then((supported) => {
                    if (supported) {
                        Linking.openURL(mailtoLink);
                    } else {
                        dispatch(showSnackbar({ message: "No email client is installed on this device.", isError: true }));
                    }
                })
                .catch((err) => {
                    console.error("Error opening mail client:", err);
                    dispatch(showSnackbar({ message: "Could not open the email client.", isError: true }));
                });
        } catch (error) {
            console.error("sendViaEmail error:", error);
            dispatch(showSnackbar({ message: "Something went wrong while preparing the email.", isError: true }));
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Invoice Preview</Text>

                    <ScrollView style={styles.card}>
                        {/* Store Info */}
                        <Text style={styles.storeName}>{companyModel?.ioe_storename}</Text>
                        <Text style={styles.address}>{companyModel?.cmp_address}</Text>

                        <View style={styles.divider} />

                        {/* Checkout Model */}
                        <Text style={styles.label}>
                            <Text style={styles.bold}>Customer:</Text> {userProfile?.ireg_firstname} {userProfile?.ireg_lastname}
                        </Text>
                        <Text style={styles.label}>
                            <Text style={styles.bold}>Email:</Text> {userProfile?.ireg_email}
                        </Text>
                        <Text style={styles.label}>
                            <Text style={styles.bold}>Phone:</Text> {userProfile?.ireg_phone1 ?? userProfile?.ireg_phone2 ?? ""}
                        </Text>

                        <View style={styles.divider} />

                        {/* Table Header */}
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={[styles.tableCell, styles.flex2, styles.bold]}>Item</Text>
                            <Text style={[styles.tableCell, styles.center, styles.bold]}>Qty</Text>
                            <Text style={[styles.tableCell, styles.center, styles.bold]}>Price</Text>
                            <Text style={[styles.tableCell, styles.center, styles.bold]}>Total</Text>
                        </View>

                        {/* Table Rows */}
                        {items.length > 0 ? (
                            items.map((item, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={[styles.tableCell, styles.flex2]}>{item.iba_it_name}</Text>
                                    <Text style={[styles.tableCell, styles.center]}>{item.iba_qty}</Text>
                                    <Text style={[styles.tableCell, styles.center]}>
                                        ${item.iba_price}
                                    </Text>
                                    <Text style={[styles.tableCell, styles.center]}>
                                        ${item.iba_total}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={{ marginVertical: 10, color: "#888", textAlign: "center" }}>
                                No items found
                            </Text>
                        )}

                        <View style={styles.divider} />

                        <Text style={styles.label}>
                            <Text style={styles.bold}>Payment Mode:</Text>{" "}
                            <Text style={styles.cashOnDelivery}>{paymentMethod}</Text>
                        </Text>

                        <Text style={styles.total}>
                            <Text style={styles.bold}>Total:</Text> {totalAmount} USD
                        </Text>
                    </ScrollView>

                    {/* Buttons */}
                    <TouchableOpacity style={[styles.button, styles.whatsapp]} onPress={sendViaWhatsApp}>
                        <Text style={styles.buttonText}>Send via WhatsApp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.email]} onPress={sendViaEmail}>
                        <Text style={styles.buttonText}>Send via Email</Text>
                    </TouchableOpacity>

                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default InvoicePreviewModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "90%",
        height: "90%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        position: "relative",
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 10,
    },
    card: {
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
    },
    storeName: {
        fontSize: 18,
        fontWeight: "700",
    },
    address: {
        color: "#555",
        marginTop: 4,
        marginBottom: 8,
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        marginVertical: 10,
    },
    label: {
        fontSize: 14,
        marginVertical: 2,
        color: "#333",
    },
    bold: {
        fontWeight: "700",
    },
    cashOnDelivery: {
        color: "green",
        fontWeight: "700",
    },
    total: {
        fontSize: 16,
        fontWeight: "600",
        color: "#444",
        marginTop: 8,
        textAlign: "right",
    },
    /* Table Styles */
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingVertical: 6,
        alignItems: "center",
    },
    tableHeader: {
        backgroundColor: "#f1f1f1",
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
    },
    tableCell: {
        flex: 1,
        fontSize: 14,
        color: "#333",
    },
    flex2: {
        flex: 2,
    },
    center: {
        textAlign: "center",
    },
    /* Buttons */
    button: {
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: "center",
        marginBottom: 10,
    },
    whatsapp: {
        backgroundColor: "#25D366",
    },
    email: {
        backgroundColor: "#C48C2B",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 6,
    },
    closeText: {
        fontSize: 20,
        color: "#555",
    },
});
