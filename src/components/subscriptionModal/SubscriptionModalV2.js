import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { scaleSize } from "../../styles/mixins";
import { colors } from "../../styles/theme";

const SubscriptionModalV2 = ({ isVisible, hideModal, code }) => {
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [promoCode, setPromoCode] = useState("");

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          {/* Close Button */}
          <Pressable onPress={hideModal} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

          {/* 7 Days Free Trial */}
          <Text style={styles.freeTrialText}>7 days free trial</Text>

          {/* Promo Code */}
          <View style={styles.promoCodeContainer}>
            <TextInput
              value={promoCode}
              onChangeText={setPromoCode}
              placeholder="Promo Code"
              placeholderTextColor="#ccc"
              style={styles.promoInput}
            />
            <Pressable style={styles.applyButton}>
              <Text style={styles.applyText}>Apply</Text>
            </Pressable>
          </View>

          {/* Subscription Plans */}
          <View style={styles.planSection}>
            {/* Yearly Plan */}
            <Pressable
              style={[
                styles.planBox,
                selectedPlan === "yearly" && styles.selectedPlan,
              ]}
              onPress={() => setSelectedPlan("yearly")}
            >
              <View style={styles.saveBadge}>
                <Text style={styles.saveText}>SAVE 50%</Text>
              </View>
              <Text style={styles.planTitle}>Yearly</Text>
              <Text style={styles.planPrice}>$59</Text>
              <Text style={styles.planPeriod}>PER YEAR</Text>
              <Text style={styles.planNote}>Collectible once a year.</Text>
              <Text style={styles.monthlyEquivalent}>$5/MONTH</Text>
            </Pressable>

            {/* Monthly Plan */}
            <Pressable
              style={[
                styles.planBox,
                selectedPlan === "monthly" && styles.selectedPlan,
              ]}
              onPress={() => setSelectedPlan("monthly")}
            >
              <Text style={styles.planTitle}>Monthly</Text>
              <Text style={styles.planPrice}>$9.99</Text>
              <Text style={styles.planPeriod}>PER MONTH</Text>
            </Pressable>
          </View>

          {/* Subscribe Button */}
          <Pressable style={styles.subscribeButton}>
            <Text style={styles.subscribeText}>Subscribe</Text>
          </Pressable>

          {/* Cancel Anytime */}
          <Text style={styles.cancelText}>Cancel anytime.</Text>

          {/* Contact Info */}
          <Text style={styles.contactText}>
            WhatsApp: +44 730 142 6350 |{" "}
            <Text style={styles.linkText}>Contact US</Text>
          </Text>

          {/* Terms */}
          <Text style={styles.termsText}>
            By clicking Subscribe, you agree to the Terms and Conditions for
            subscription and promotional coupons; the subscription costs
            $5/month, includes [list key benefits], renews automatically unless
            canceled at least 24 hours before renewal.
          </Text>

          {/* Footer Links */}
          <Text style={styles.footerLinks}>
            <Text style={styles.linkText}>Term & Condition</Text> |{" "}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: colors.mustardYellow2,
    padding: scaleSize(20),
    borderTopLeftRadius: scaleSize(20),
    borderTopRightRadius: scaleSize(20),
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: scaleSize(10),
    right: scaleSize(10),
  },
  closeText: {
    fontSize: scaleSize(15),
    color: "#000",
  },
  freeTrialText: {
    fontSize: scaleSize(18),
    color: "#fff",
    fontWeight: "bold",
    backgroundColor: "#C62F2F",
    paddingHorizontal: scaleSize(12),
    paddingVertical: scaleSize(4),
    borderRadius: scaleSize(6),
    marginBottom: scaleSize(10),
  },
  promoCodeContainer: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#111",
    borderRadius: scaleSize(10),
    marginBottom: scaleSize(15),
    overflow: "hidden",
  },
  promoInput: {
    flex: 1,
    padding: scaleSize(10),
    color: "#fff",
  },
  applyButton: {
    backgroundColor: "#000",
    paddingVertical: scaleSize(10),
    paddingHorizontal: scaleSize(15),
    justifyContent: "center",
  },
  applyText: {
    color: "#fff",
    fontWeight: "bold",
  },
  planSection: {
    flexDirection: "column",
    width: "100%",
    gap: scaleSize(10),
  },
  planBox: {
    backgroundColor: "#4F0F0F",
    borderRadius: scaleSize(15),
    padding: scaleSize(15),
    width: "100%",
    alignItems: "center",
  },
  selectedPlan: {
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  saveBadge: {
    backgroundColor: "#FFD700",
    paddingVertical: scaleSize(2),
    paddingHorizontal: scaleSize(8),
    borderRadius: scaleSize(8),
    alignSelf: "flex-end",
    marginBottom: scaleSize(5),
  },
  saveText: {
    fontSize: scaleSize(10),
    fontWeight: "bold",
    color: "#000",
  },
  planTitle: {
    color: "#fff",
    fontSize: scaleSize(18),
    fontWeight: "bold",
  },
  planPrice: {
    fontSize: scaleSize(26),
    fontWeight: "bold",
    color: "#fff",
  },
  planPeriod: {
    color: "#fff",
    fontSize: scaleSize(14),
    marginBottom: scaleSize(4),
  },
  planNote: {
    color: "#ccc",
    fontSize: scaleSize(12),
    marginBottom: scaleSize(4),
  },
  monthlyEquivalent: {
    color: "#fff",
    fontSize: scaleSize(14),
    fontWeight: "bold",
  },
  subscribeButton: {
    marginTop: scaleSize(20),
    backgroundColor: "#4F0F0F",
    paddingVertical: scaleSize(14),
    paddingHorizontal: scaleSize(40),
    borderRadius: scaleSize(20),
    width: "100%",
    alignItems: "center",
  },
  subscribeText: {
    color: "#fff",
    fontSize: scaleSize(18),
    fontWeight: "bold",
  },
  cancelText: {
    marginTop: scaleSize(10),
    fontSize: scaleSize(12),
    color: "#000",
  },
  contactText: {
    fontSize: scaleSize(12),
    color: "#000",
    marginTop: scaleSize(10),
  },
  termsText: {
    fontSize: scaleSize(10),
    color: "#333",
    marginTop: scaleSize(10),
    textAlign: "center",
  },
  footerLinks: {
    fontSize: scaleSize(10),
    color: "#000",
    marginTop: scaleSize(10),
  },
  linkText: {
    textDecorationLine: "underline",
    color: "#000",
  },
});

export default SubscriptionModalV2;
