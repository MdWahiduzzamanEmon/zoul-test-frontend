import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from "react-native";
import { scaleSize } from "../../styles/mixins";
import CheckCircle from "../../assets/icons/CheckCircle.svg"; // Ensure SVG is correctly imported

const SubscriptionModalV2 = ({ isVisible, hideModal, code }) => {
  const [selectedPlan, setSelectedPlan] = useState("pro");

  // Subscription Features List
  const features = [
    "Up to 10 projects",
    "Up to 1000 projects",
    "Basic analytics",
  ];

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          {/* Close Button */}
          <Pressable onPress={hideModal} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

          {/* Title */}
          <Text style={styles.title}>Subscribe to get more</Text>
          <Text style={styles.subtitle}>
            All plans come with a 30-day money-back guarantee
          </Text>

          {/* Subscription Options */}
          <View style={styles.planContainer}>
            {["pro", "enterprise"].map((plan) => (
              <Pressable
                key={plan}
                style={[
                  styles.planBox,
                  selectedPlan === plan && styles.selectedPlan,
                ]}
                onPress={() => setSelectedPlan(plan)}
              >
                <Text style={styles.planTitle}>
                  {plan === "pro" ? "PRO" : "Enterprise"} account
                </Text>
                <Text style={styles.planPrice}>$8/month</Text>

                {/* Feature List */}
                <FlatList
                  data={features}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <View style={styles.featureRow}>
                      <CheckCircle width={16} height={16} color="black" />
                      <Text style={styles.featureText}>{item}</Text>
                    </View>
                  )}
                />

                {selectedPlan === plan && <View style={styles.dot} />}
              </Pressable>
            ))}
          </View>

          {/* Promo Code Section (If available) */}
          {code && (
            <Text style={styles.promoCodeText}>
              Promo Code Applied:{" "}
              <Text style={{ fontWeight: "bold" }}>{code}</Text>
            </Text>
          )}

          {/* Billing Details Button */}
          <Pressable style={styles.billingButton}>
            <Text style={styles.billingButtonText}>Billing details</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end", // 👈 Move modal to the bottom
  },
  container: {
    backgroundColor: "white",
    width: "100%", // Full width
    padding: scaleSize(20),
    borderTopLeftRadius: scaleSize(15), // Rounded top corners
    borderTopRightRadius: scaleSize(15),
    alignItems: "center",
    paddingBottom: scaleSize(30),
  },
  closeButton: {
    position: "absolute",
    top: scaleSize(10),
    right: scaleSize(10),
    padding: scaleSize(5),
  },
  closeText: {
    fontSize: scaleSize(18),
    color: "black",
  },
  title: {
    fontSize: scaleSize(20),
    fontWeight: "bold",
    marginBottom: scaleSize(5),
  },
  subtitle: {
    fontSize: scaleSize(14),
    color: "gray",
    marginBottom: scaleSize(20),
    textAlign: "center",
  },
  planContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  planBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#800000",
    borderRadius: scaleSize(10),
    padding: scaleSize(15),
    marginHorizontal: scaleSize(5),
    alignItems: "center",
    backgroundColor: "white",
    position: "relative",
  },
  selectedPlan: {
    backgroundColor: "#f9f0f0",
  },
  planTitle: {
    fontSize: scaleSize(14),
    fontWeight: "bold",
    color: "black",
  },
  planPrice: {
    fontSize: scaleSize(18),
    fontWeight: "bold",
    color: "black",
    marginBottom: scaleSize(5),
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: scaleSize(2),
  },
  featureText: {
    fontSize: scaleSize(12),
    marginLeft: scaleSize(5),
    color: "black",
  },
  dot: {
    width: scaleSize(10),
    height: scaleSize(10),
    backgroundColor: "#800000",
    borderRadius: scaleSize(5),
    position: "absolute",
    top: scaleSize(10),
    right: scaleSize(10),
  },
  promoCodeText: {
    fontSize: scaleSize(14),
    color: "#800000",
    marginTop: scaleSize(10),
  },
  billingButton: {
    backgroundColor: "#800000",
    paddingVertical: scaleSize(10),
    paddingHorizontal: scaleSize(20),
    borderRadius: scaleSize(10),
    marginTop: scaleSize(20),
    width: "100%",
    alignItems: "center",
  },
  billingButtonText: {
    color: "white",
    fontSize: scaleSize(16),
  },
});

export default SubscriptionModalV2;
