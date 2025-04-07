import React, { useCallback, useState } from "react";
import {
  ImageBackground,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Block from "../../components/utilities/Block";
import Text from "../../components/utilities/Text";
import { perfectSize, responsiveScale, scaleSize } from "../../styles/mixins";
import { colors, deviceHeight, deviceWidth } from "../../styles/theme";
import BackIcon from "../../assets/appImages/svgImages/BackIcon";
import ConfirmationModal from "../../components/modal/ConfirmationModal";
import { deleteUserAccount } from "../../resources/baseServices/app";
import { useModal } from "../../context/ModalContext";
import { clearAsyncStorage } from "../../helpers/auth";
import { removeAuthTokenAction } from "../../store/auth";
import { useDispatch } from "react-redux";
import { LandingLogo } from "../../icons/landing/landing-logo";

const TermsAndConditions = ({ navigation }) => {
  const modal = useModal();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [isDeleteSuccessful, setIsDeleteSuccessful] = useState(false);
  // const handleSetting = () => {
  //   navigation.navigate("Settings");
  // };
  const cancelDelete = () => {
    setIsModalVisible(false);
  };
  const handleCancle = () => {
    setIsModalVisible(false);
  };
  const confirmDelete = async () => {
    console.log("deleted user account");
    await handleDeleteAccountBtn();
  };
  const handleDeleteAccountBtn = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await deleteUserAccount();
      if (res?.data?.status === "success") {
        // dispatch(removeAuthTokenAction());
        // await clearAsyncStorage();
        // navigation.goBack();
        setResultMessage(res?.data?.message);
        setIsDeleteSuccessful(true);
        setIsModalVisible(false);
        // setTimeout(() => {
        setIsResultModalVisible(true);
        // }, 2000);
      }
    } catch (error) {
      console.error("error delete user account =--->", error);
      modal.show(ErrorDialog, {
        message:
          error?.response?.data?.message ?? ERROR_CONTACT_SUPPORT_MESSAGE,
        onConfirm: () => modal.close(),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);
  const ResultModal = ({ isVisible, message, isSuccess, onContinue }) => {
    return (
      <Modal transparent visible={isVisible}>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={onContinue}
        >
          <Block flex={false} style={styles.modalContent}>
            <Text
              size={responsiveScale(18)}
              color={isSuccess ? colors.white : colors.white}
              style={styles.modalText}
              regular
            >
              {message}
            </Text>
            <TouchableOpacity
              onPress={onContinue}
              style={styles.ContinueButton}
            >
              <Text size={responsiveScale(16)} color={colors.black}>
                Continue
              </Text>
            </TouchableOpacity>
          </Block>
        </TouchableOpacity>
      </Modal>
    );
  };
  return (
    <Block flex={1}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={require("../../assets/appImages/ExploreBackgroundImageNew.png")}
        resizeMode="stretch"
        style={styles.bgImage}
      >
        <Block flex={1}>
          {/* header View */}
          <Block flex={false} style={styles.headerContainer}>
            <Block
              flex={false}
              row
              between
              center
              style={{ alignItems: "flex-end" }}
            >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackIcon height={32} width={32} />
              </TouchableOpacity>
              <LandingLogo
                color={colors.logoColor}
                height={perfectSize(60)}
                width={perfectSize(100)}
              />
              <TouchableOpacity
                style={{ width: 32, height: 32 }}
                disabled={true}
                onPress={() => {}}
              >
                {/* <DeleteIcon height={24} width={24} /> */}
              </TouchableOpacity>
            </Block>
            <Block flex={false} style={{ marginTop: perfectSize(10) }}>
              <Text medium size={scaleSize(32)} color={colors.white}>
                Terms & Conditions
              </Text>
            </Block>
          </Block>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: perfectSize(40) }}
          >
            <Block flex={1} style={{ paddingHorizontal: perfectSize(16) }}>
              <Text regular size={scaleSize(17)} color={colors.white}>
                Zoul Terms of Service for the EEA, Switzerland, and UK{"\n"}
                Please refer to the Privacy Policy for information regarding how
                we collect, use, and disclose information about you.{"\n"}
                For Zoul users in countries and territories outside of the
                European Economic Area (which includes the European Union),
                Switzerland, or the United Kingdom, the Zoul Terms of Service
                apply to your use of the Services.{"\n"}
                For Zoul users in countries in the European Economic Area (which
                includes the European Union), Switzerland, or the United
                Kingdom, the Zoul Terms of Service for the EEA, Switzerland, and
                UK apply to your use of the Services.{"\n"}
                Updated: May 3, 2024
              </Text>
            </Block>
            <Block
              flex={1}
              style={{
                paddingHorizontal: perfectSize(16),
                marginTop: "7%",
              }}
            >
              <Text regular size={responsiveScale(17)} color={colors.white}>
                These Terms of Service (the “Terms”) apply to the products and
                services of Zoulmeditation.com and our subsidiaries and
                affiliates (“Zoul,” “we,” or “us”), including our websites,
                {"\n"}
                social media pages, software applications, and other online
                services (collectively, the “Services”).
              </Text>
            </Block>
            <Block
              flex={1}
              style={{
                paddingHorizontal: perfectSize(16),
                marginTop: "7%",
              }}
            >
              <Text regular size={responsiveScale(17)} color={colors.white}>
                1. Agreement to Terms{"\n"}
                Please read these Terms carefully. By accessing or using the
                Services, you acknowledge that you have read these Terms, that
                these Terms govern your use of the Services, and that you agree
                to them.
              </Text>
            </Block>
            <Block
              flex={1}
              style={{
                paddingHorizontal: perfectSize(16),
                marginTop: "7%",
              }}
            >
              <Text regular size={responsiveScale(17)} color={colors.white}>
                2. Additional Terms{"\n"}
                We may also have different or additional terms in relation to
                some of the Services. Unless we say otherwise in those terms,
                those terms supplement and are part of these Terms and will
                control to the extent there is a conflict with these Terms.
                Additional terms that apply to some aspects of the Services
                include but are not limited to the Zoul Terms and Conditions.
              </Text>
            </Block>
            <Block
              flex={1}
              style={{
                paddingHorizontal: perfectSize(16),
                marginTop: "7%",
              }}
            >
              <Text regular size={responsiveScale(17)} color={colors.white}>
                3. Service Use{"\n"}
                Eligibility. You must be 16 years or older to use the Services.
                If you are under the age of majority where you live, you may
                only use the Services if your parent or guardian agrees to our
                Terms. Please read these Terms with them. If you are a parent or
                legal guardian of a user under the age of majority where you
                live, you are subject to these Terms and responsible for your
                child’s activity on the Services.{"\n"}
                Account Registration and Security. To use many of the Services,
                you must register for an account. You must provide accurate
                account information, keep this information updated, and maintain
                the security of your account. Notify us immediately by email at
                admin@zoul.app of any unauthorized use of your account or any
                other breach of security. If you permit others to use your
                account, you are responsible for the activities of those users
                unless you prove that such use is fraudulent. You agree not to
                create an account if we have previously removed you or your
                account from any of the Services without our permission.
              </Text>
            </Block>
            <Block
              flex={1}
              style={{
                paddingHorizontal: perfectSize(16),
                marginTop: "7%",
              }}
            >
              <Text regular size={responsiveScale(17)} color={colors.white}>
                4. Subscriptions and Promotional Offers{"\n"}
                This section provides terms related to the Services that are
                only available with a paid subscription.{"\n\n"}
                a. Recurring Subscriptions. If you purchase a recurring
                subscription to use Zoul (“Recurring Subscriptions”), the
                subscription will be continuous for the subscription period you
                select and will automatically renew for another subscription
                period until canceled. You authorize Zoul to automatically
                charge your designated payment method at the beginning of each
                subscription period for the then-current price of your Recurring
                Subscription, along with any applicable taxes and fees
                specified, unless canceled in accordance with section 4(c). If
                we are not able to charge your payment method for your Recurring
                Subscription, you remain responsible for any uncollected
                amounts.{"\n\n"}
                b. Cancellation. You must cancel your Recurring Subscription at
                least 24 hours before the end of your current subscription
                period to avoid being charged for the next subscription period.
                If you purchased your Recurring Subscription via Zoul.com, you
                can cancel at Zoul manage subscription page. If you purchased
                your Recurring Subscription through a third-party, like an app
                store, you must cancel the renewal directly with that
                third-party. Contact us by email at admin@zoul.app if you need
                assistance with canceling a Recurring Subscription. If you
                cancel, you are not entitled to a refund for the fees you
                already paid, but, subject to these Terms, you will continue to
                receive access to Zoul subscription until the end of your
                current subscription period.{"\n\n"}
                c. Changes. We may make changes to your Recurring Subscription,
                including price changes. We will communicate material changes to
                your Recurring Subscription, including any changes to the price,
                at least 30 days in advance to the email address associated with
                your account. If you do not agree to those changes, you can
                cancel your subscription as described in section 4(c). We will
                not make price changes that become effective during the middle
                of a Recurring Subscription period.{"\n\n"}
                d. Promotional Offers Converting to Recurring Subscriptions. You
                may be offered a promotional offer in connection with a
                Recurring Subscription, such as a trial period or initial
                discount (each a “Promotional Offer”). Additional terms specific
                to each Promotional Offer we offer will be as described in the
                particular offer (“Offer Terms”). You must meet all eligibility
                requirements stated in these Terms and the Offer Terms to enroll
                in a Promotional Offer. Unless stated otherwise in the Offer
                Terms, Promotional Offers are only for new customers who have
                not previously subscribed to Zoul or enrolled in a Promotional
                Offer. If the Offer Terms state that an offer is available only
                to past subscribers, you must have been a subscriber to Zoul
                subscription and allowed your subscription to expire before the
                date stated in the Offer Terms. Zoul reserves the right, in its
                discretion, to determine your Promotional Offer eligibility, and
                to modify or cancel a Promotional Offer at any time. Promotional
                Offers may only be claimed through zoul.com by any advertised
                expiration date.{"\n\n"}
                You must provide a valid payment method accepted by us to enroll
                in a Promotional Offer unless otherwise stated in the Offer
                Terms. Once your promotional period ends, you authorize Zoul to
                begin billing your designated payment method on a recurring
                basis at the then-current price for the relevant subscription
                plus any applicable taxes unless it is canceled in accordance
                with section 4(c) at least 24 hours prior to the end of the
                promotional period.
              </Text>
            </Block>
            <Block
              flex={1}
              style={{
                paddingHorizontal: perfectSize(16),
                marginTop: "7%",
              }}
            >
              <Text regular size={responsiveScale(17)} color={colors.white}>
                5. Other Payments Terms{"\n"}
                a. Payment Method. If you purchase a subscription, gift card, or
                other item through the Services, you must provide an accurate
                and up-to-date payment method acceptable by us. You authorize
                Zoul to charge any purchase to your designated payment method,
                including the then-current price plus any applicable taxes and
                fees specified. No transaction is binding on Zoul until accepted
                and confirmed by Zoul. We may update your stored payment method
                using information provided by our payment service providers.
                Following any update, you authorize us to continue to charge the
                applicable payment method(s). You are responsible for any
                additional charges that your payment method provider charges.
                {"\n\n"}
                b. Cancellations and Disputes. If you have any concerns
                regarding any transactions through the Services, we encourage
                you to raise them with us first and not cancel or reverse
                charges through your payment method provider unless you have
                made a reasonable attempt to resolve the matter directly with us
                or otherwise as provided by applicable law. Zoul reserves the
                right to verify your identity or request more information in
                connection with your purchases, and not to process or to cancel
                purchase requests, including if we suspect fraud or if your
                payment method is declined.{"\n\n"}
                c. Withdrawal Rights. You have a legal right to cancel your
                purchase of Recurring Subscription and receive a full refund at
                any time within 14 days from the date of purchase of your
                subscription. To exercise the right of withdrawal, you must
                inform us of your decision to withdraw by an unequivocal
                statement. You may use the below model withdrawal form, but it
                is not required. You can send your withdrawal notice to us by
                email or by mail to us using the contact information provided in
                section 20 below. If you submit our electronic form, we will
                confirm receipt on a durable medium (e.g., by email) without
                undue delay. To be effective, you must send your notice of
                withdrawal before the 14-day deadline expires. However, this
                right will be lost if you use the Services pursuant to your
                subscription during the 14-day cancellation period unless the
                Services are defective during that period. We will provide the
                refund to the payment method originally charged for your
                subscription unless you agree otherwise.{"\n\n"}
                Sample withdrawal form (If you want to withdraw from the
                contract, please fill out this form and send it back).{"\n"}o
                To:{"\n"}o I hereby give notice that I withdrawal from the
                contract concluded by me [for the sale of the following
                goods(*)/for the provision of the following service(*)],
                [ordered on(*) / received on(*)].{"\n"}o Name of consumer:{"\n"}
                o Address of consumer:{"\n"}o Signature of consumer (only if
                this form is notified on paper):{"\n"}o Date: (*) Delete as
                applicable.{"\n\n"}
                d. Future Functionality. Subject to the limitations mentioned in
                section 16, your purchases are not contingent on the delivery of
                any current or future functionality, content, or features.
              </Text>
            </Block>
            <Block
              flex={1}
              style={{
                paddingHorizontal: perfectSize(16),
                marginTop: "7%",
              }}
            >
              <Text regular size={responsiveScale(17)} color={colors.white}>
                6. Services and User Content Rights{"\n"}
                a. Zoul Services Ownership. Subject to the limited license
                rights granted under these Terms, Zoul and its licensors
                exclusively own all right, title, and interest in and to the
                Services, including all text, graphics, images, audio, video, or
                other materials made available via the Services, and all
                associated intellectual property rights. You acknowledge that
                the Services are protected by intellectual property rights and
                other laws of the U.S. and foreign countries. You will not
                remove, alter, or obscure any copyright, trademark, service
                mark, or other proprietary rights notices incorporated in or
                accompanying any part of the Services. You will not reproduce,
                distribute, modify, create derivative works of, publicly
                display, publicly perform, republish, download, store, or
                transmit any of the Services, except as necessary for your
                permitted use of the Services.{"\n\n"}
                b. Limited License Granted by Zoul. Subject to your compliance
                with these Terms, Zoul grants you a limited, non-exclusive,
                non-transferable, non-sublicensable, and revocable license to
                access and use the Services solely for your personal,
                non-commercial purposes (unless Zoul has granted you written
                permission to do otherwise, for example on a trial or test
                basis). Further, Zoul grants you a limited non-exclusive,
                non-transferable, and non-sublicensable license to download and
                install a copy of any mobile app we distribute through an App
                Store on a mobile device that you own or control. Any use of the
                Services other than as specifically authorized herein, without
                our prior written permission, is strictly prohibited, will
                terminate the license granted herein, and will violate our
                intellectual property rights. Subject to your mobile device
                configurations, you authorize us to automatically install
                updates to any of our mobile apps following appropriate notice
                of such updates.{"\n\n"}
                c. User Content Ownership. Except for the license you grant
                below, Zoul does not claim any ownership rights in any messages,
                images, text, or other content posted through the Services by
                our users, including any content you post to social media
                platforms that tags a Zoul account or that uses a hashtag
                incorporating a Zoul trademark (collectively, “User Content”).
                Your User Content may be protected by intellectual property
                rights. User Content does not include any portion of the
                Services included in your User Content. Nothing in these Terms
                will be deemed to restrict any mandatory rights that you may
                have to use and exploit your User Content, as between you and
                Zoul.{"\n\n"}
                d. License You Grant to Zoul. By making any User Content
                available to Zoul, you hereby grant to Zoul a non-exclusive,
                transferable, sublicensable, worldwide, royalty-free, license to
                use, store, publish, translate, reproduce, adapt, copy, modify,
                create derivative works based upon, publicly display, publicly
                perform, and distribute your User Content and any name,
                username, or likeness provided in connection with your User
                Content in all media formats and channels now known or later
                developed in connection with operating, marketing, and providing
                the Services without compensation to you, and to the extent
                permitted by applicable laws, you hereby waive all moral or
                special rights in this regard. This license lasts for as long as
                your content is protected by intellectual property rights. When
                you post or otherwise share User Content on or through the
                Services, you understand that your User Content and any
                associated information may be visible to others. You represent
                and warrant that your User Content, and our use of such content
                as permitted by these Terms, will not violate any rights of or
                cause injury to any person or entity.
              </Text>
            </Block>
            <Block
              flex={1}
              style={{
                paddingHorizontal: perfectSize(16),
                marginTop: "7%",
              }}
            >
              <Text regular size={responsiveScale(17)} color={colors.white}>
                7. Third-Party Content{"\n"}
                The Services may contain information about, and links to,
                third-party products, services, websites, resources, activities,
                or events, and we may allow third-parties to make their content
                and information available on or through the Services
                (collectively, “Third-Party Content”). We provide Third-Party
                Content only as a convenience and do not control or endorse any
                Third-Party Content. To the extent permitted by applicable laws,
                you acknowledge sole responsibility for, and assume all risk
                arising from, your access to and use of such Third-Party
                Content. Your use of or access to any Third-Party Content is
                solely a relationship between you and the applicable third
                party, and is subject to the terms and conditions of, or your
                agreement with, such third party.
              </Text>
            </Block>
            <Block
              flex={1}
              style={{
                paddingHorizontal: perfectSize(16),
                marginTop: "7%",
              }}
            >
              <Text regular size={responsiveScale(17)} color={colors.white}>
                8. Complaints{"\n"}
                Please contact admin@zoul.app to notify us of anything on the
                Services that infringes other rights (like copyright,
                counterfeiting, insult, invasion of privacy) or if you believe
                that User Content is otherwise illegal (e.g., promotes crimes
                against humanity, incites racial hatred or violence, or concerns
                child pornography). When submitting a notice, you must identify
                the date of notification; if you are a natural person: your full
                name, profession, domicile, nationality, date and place of
                birth; the name and domicile of the recipient or, in the case of
                a legal person, its name and registered office; the description
                of the disputed content and its precise location (e.g., URL link
                to the disputed content); the reasons why the content must be
                removed, including the legal provisions and justifications of
                facts; a copy of the correspondence addressed to the author or
                publisher of the disputed content requesting its interruption,
                removal or modification, or justification that the author or
                publisher could not be contacted.
              </Text>
            </Block>
            <Block
              flex={1}
              style={{
                paddingHorizontal: perfectSize(16),
                marginTop: "7%",
              }}
            >
              <Text regular size={responsiveScale(17)} color={colors.white}>
                8. Complaints{"\n"}
                Please contact admin@zoul.app to notify us of anything on the
                Services that infringes other rights (like copyright,
                counterfeiting, insult, invasion of privacy) or if you believe
                that User Content is otherwise illegal (e.g., promotes crimes
                against humanity, incites racial hatred or violence, or concerns
                child pornography). When submitting a notice, you must identify
                the date of notification; if you are a natural person: your full
                name, profession, domicile, nationality, date and place of
                birth; the name and domicile of the recipient or, in the case of
                a legal person, its name and registered office; the description
                of the disputed content and its precise location (e.g., URL link
                to the disputed content); the reasons why the content must be
                removed, including the legal provisions and justifications of
                facts; a copy of the correspondence addressed to the author or
                publisher of the disputed content requesting its interruption,
                removal or modification, or justification that the author or
                publisher could not be contacted.
              </Text>
            </Block>
            <Block
              flex={1}
              style={{
                paddingHorizontal: perfectSize(16),
                marginTop: "7%",
              }}
            >
              <Text regular size={responsiveScale(17)} color={colors.white}>
                9. Prohibitions on User Content and Conduct{"\n"}
                You are solely responsible for your User Content and conduct
                while using the Services, and will not do any of the following:
                {"\n"}
                a. Post, upload, create, publish, store, submit, transmit, or
                otherwise share any User Content that: {"\n"}(i) is confidential
                and for which you do not have all necessary rights to disclose
                or to grant us the license described above;{"\n"}
                (ii) may or does infringe, misappropriate, or violate a
                third-party’s patent, copyright, trademark, trade secret, moral
                rights, or other intellectual property rights, or rights of
                publicity or privacy; {"\n"} (iii) violates, or encourages any
                conduct that would violate, these Terms, the rights of any
                party, or otherwise create liability or violate any applicable
                local, state, national, or international law or regulation or
                would give rise to civil or criminal liability; {"\n"}(iv) is
                fraudulent, false, misleading, or deceptive; {"\n"}(v)
                impersonates or misrepresents your affiliation with, any person
                or entity or contains or depicts any statements, remarks, or
                claims that do not reflect your honest views and experiences;{" "}
                {"\n"}(vi) is defamatory, obscene, pornographic, vulgar,
                offensive, unlawful, libelous, indecent, lewd, suggestive,
                abusive, or inflammatory; {"\n"}(vii) promotes discrimination,
                bigotry, racism, hatred, harassment, or harm against any
                individual or group; {"\n"}(viii) is violent or threatening or
                promotes violence or actions that are threatening to any person
                or entity; {"\n"}(ix) promotes illegal or harmful activities or
                substances; {"\n"}(x) contains any unsolicited or{"\n"}
                unauthorized promotions, political campaigning, advertising, or
                solicitations;
                {"\n"} (xi) contains any viruses, corrupted data, or other
                harmful, disruptive, or destructive files or content; or {"\n"}
                (xii) in our reasonable judgment, is objectionable, restricts,
                or inhibits any other person from using or enjoying the
                Services, or may expose Zoul or others to any harm or liability
                of any type;
                {"\n\n"}
                b. Copy, reproduce, distribute, use, publicly perform, or
                publicly display, mirror, or frame the Services, or any
                individual element within the Services, Zoul’s name, any Zoul
                trademark, logo, or other proprietary information, or the layout
                and design of any page or form contained on a page, without
                express written consent from Zoul or its licensors; {"\n\n"}
                c. Modify the Services, remove any proprietary rights notices,
                or markings, or otherwise make any derivative works based upon
                the Services;
                {"\n\n"}
                d. Use the Services other than for their intended purpose and in
                any manner not permitted by these Terms, that violates these
                Terms or any applicable law, regulation, contract, intellectual
                property right, or other third-party right, or that could
                interfere with, disrupt, negatively affect, or inhibit other
                users from fully enjoying the Services, or that could damage,
                disable, overburden, or impair the functioning of the Services
                in any manner; {"\n\n"}
                e. Develop or use any applications that interact with the
                Services without our prior written consent; {"\n\n"}
                f. Avoid, bypass, ignore, remove, deactivate, impair,
                descramble, or otherwise circumvent any technological measure
                implemented by Zoul or any of Zoul’s providers or any other
                third-party (including another user) to protect the Services;{" "}
                {"\n\n"}
                g. Attempt to access or search the Services, scrape, or extract
                data or other content from the Services, including through the
                use of any engine, software, tool, agent, device, or mechanism
                (including spiders, robots, crawlers, data mining tools, or the
                like) other than the software or search agents provided by Zoul
                or as permitted by our robot.txt file; {"\n\n"}
                h. Attempt to decipher, decompile, disassemble, or reverse
                engineer any of the software used to provide the Services
                (except to the extent such prohibition is not permitted under
                applicable law), or do anything that might discover source code;{" "}
                {"\n\n"}
                i. Interfere with, or attempt to interfere with, the access of
                any user, host, or network, including, without limitation,
                sending a virus, overloading, flooding, spamming, or
                mail-bombing the Services; {"\n\n"}
                j. Collect or store any personally identifiable information from
                the Services from other users of the Services without their
                express permission;
                {"\n\n"}
                k. Engage in any harassing, threatening, intimidating,
                predatory, or stalking conduct; {"\n\n"}
                l. Use or attempt to use another user’s account without
                authorization from that user and Zoulmeditation; or {"\n\n"}
                m. Encourage or enable any other individual to do any of the
                foregoing. If we reasonably believe any User Content is in
                breach of these Terms, we may remove or refuse to display such
                content. Where possible, we will attempt to notify you of the
                reason for our action in writing (email suffices) unless we
                reasonably believe that notice would: {"\n"}(i) violate the law;
                {"\n"}
                (ii) pose a risk of liability for us or our affiliates;{"\n"}
                (iii) hinder an investigation; {"\n"}(iv) pose a risk to the
                operation of the Services; or {"\n"}(v) harm any user or other
                party. Our failure to enforce this section in some instances
                does not constitute a waiver of our right to enforce it in other
                instances. We have the right to investigate violations of these
                Terms or conduct that affects the Services. We may also consult
                and cooperate with law enforcement authorities to prosecute
                users who violate the law. In addition, this section does not
                create any private right of action on the part of any third-/n
                party or any reasonable expectation that the Services will not
                contain any User Content that is prohibited by such rules.
              </Text>
            </Block>
            <Block
              flex={1}
              style={{
                paddingHorizontal: perfectSize(16),
                marginTop: "7%",
              }}
            >
              <Text regular size={responsiveScale(17)} color={colors.white}>
                10. Trademarks{"\n"}
                Zoul’s trademarks, including but not limited to Zoul, WHERE
                WELLNESS MEETS LIBERATION and Zoul’s logos, product and service
                names, slogans, and the look and feel of the Services may not be
                copied, imitated or used, in whole or in part, without Zoul’s
                prior written permission. The absence of a trademark from this
                list does not constitute a waiver of Zoul’s trademark or other
                intellectual property rights concerning that trademark. All
                third-party trademarks mentioned on the Services are the
                property of their respective owners. Reference to any products,
                services, processes, or other information by trade name,
                trademark, manufacturer, supplier, or otherwise does not
                constitute or imply endorsement, sponsorship, or recommendation
                by Zoul.
                {"\n\n"}
                11. Termination or Suspension{"\n"}
                We may suspend or terminate your access to the Services if you
                materially or repeatedly breach these Terms, we are required to
                do so by law or court order, or we reasonably believe your
                conduct creates possible liability or risk of harm to us or any
                other party that we could not reasonably avoid without such
                suspension or termination. We may also suspend your account for
                a period of up to 90 days while we investigate if any of these
                conditions are present. We will provide you with written notice
                (email suffices) upon any suspension or termination, unless
                prevented from doing so by law. During any such suspension or
                termination, we will not continue to charge you for the
                Services.
                {"\n\n"}
                Please note that we may terminate your Zoul subscription if your
                Zoul subscription was obtained through a third-party promotion
                and you no longer meet the eligibility requirements for that
                offer. We will provide you with written notice (email suffices)
                upon any such cancellation.
                {"\n\n"}
                You may cancel your account at any time by sending an email to
                us at admin@zoul.app, although you will still have to cancel any
                active subscriptions as stated in section 4(c).
                {"\n\n"}
                Upon any termination, discontinuation, or cancellation of the
                Services or your account, all provisions of these Terms which by
                their nature should survive will survive, including, without
                limitation, ownership provisions, warranty disclaimers,
                limitations of liability, and dispute resolution provisions.
                {"\n\n"}
                12. Warranty and Disclaimers{"\n"}
                We provide the Services using reasonable skill and care. If we
                don’t meet the quality level described in this warranty, you
                agree to tell us and we’ll work with you to try to resolve the
                issue. The foregoing does not affect any liability that cannot
                be excluded or limited under applicable law. Consumer laws in
                your jurisdiction provide you with a legal guarantee covering
                many of the Services we provide to you. Under this guarantee,
                we’re responsible for any defect you discover in the Services.
                If you want to make a claim regarding a defect in the Services,
                please contact us at admin@zoul.app. The only commitments we
                make about the Services (including features, reliability,
                availability or suitability for you) are as described in this
                section or under the relevant laws in the jurisdiction where you
                reside.
                {"\n\n"}
                13. Medical Disclaimers{"\n"}
                a. The Services are provided for informational purposes only and
                are not intended, designed, or implied to diagnose, prevent, or
                treat any condition or disease, or to be a substitute for
                professional medical care;{"\n\n"}
                b. Zoul is not a licensed medical care provider and does not
                engage in, and has no expertise in, diagnosing, examining, or
                treating medical conditions of any kind, or in prescribing
                treatments or determining the effect of any specific treatment
                on a medical condition;{"\n\n"}
                c. Zoul does not provide emergency services and is not obligated
                to contact you or anyone on your behalf with respect to your
                medical condition or treatment;{"\n\n"}
                d. Zoul is not responsible for the accuracy, reliability,
                effectiveness, or correct use of any of the Services;{"\n\n"}
                e. You should always consult a medical professional if you have
                any questions regarding a medical condition; and{"\n\n"}
                f. You should never disregard professional medical advice or
                delay in seeking it because of something you have read or
                received using the Services. Not all activities described as
                part of the Services are suitable for everyone. Do not use the
                Services while driving, operating heavy machinery, or performing
                other tasks that require attention and concentration.
                {"\n\n"}
                14. Liability{"\n"}
                We will not be responsible (under these Terms or for negligence)
                for losses that were caused by your breach of these Terms or
                which were beyond our control and which we could not avoid
                through reasonable actions. If we fail to comply with these
                Terms, we will only be responsible for loss or damage you suffer
                that is a foreseeable result of our breaking these Terms. Loss
                or damage is foreseeable if either it is obvious that it will
                happen or if, at the time you accepted these Terms, both we and
                you knew it might happen.
                {"\n\n"}
                Nothing in these Terms is intended to exclude or limit Zoul’s
                liability for death, personal injury or fraudulent
                misrepresentation caused by our negligence or willful
                misconduct, or any other liability to the extent that such
                liability may not be excluded or limited as a matter of law.
                {"\n\n"}
                15. Governing Law and Venue{"\n"}
                These Terms and your relationship with Zoul under these Terms
                are governed by the laws of your country of residence, and you
                can file legal disputes in your local courts. If you are an
                EEA-based consumer, the European Commission also offers an
                Online Dispute Resolution platform, which we accept if required
                by law.
                {"\n\n"}
                16. Modifying and Terminating the Services{"\n"}
                We may modify or discontinue the Services from time to time when
                we have a valid reason, such as to prevent abuse or harm,
                address compliance, safety or security issues, offer new
                features or content, respond to material changes in how the
                Services are being used, or address other legal requirements. We
                will only stop offering a service or make a change that has a
                significant negative impact on your ability to use existing
                Services after considering the reasonableness of the change, our
                users’ expectations and the potential impact upon you and
                others. In most cases, we’ll provide you with reasonable advance
                notice before making that type of change along with notice of
                your right to terminate use of the Services. However, we may
                make changes without that notice to address more urgent
                situations, such as to help prevent abuse or harm, safety or
                security reasons, or to comply with legal requirements.
                {"\n\n"}
                17. Changes to Terms{"\n"}
                We may make changes to these Terms from time to time, for
                reasons including but not limited to legal or regulatory
                compliance, security, to reflect changes in the Services or how
                we do business, or to help prevent harm to us or others. We will
                provide reasonable advance notice of any material changes except
                for updates that address new Service features or in urgent
                situations, such as for compliance or safety reasons. For
                notices made by e-mail, the date of receipt will be deemed the
                date on which such notice is transmitted. Disputes arising under
                these Terms will be resolved in accordance with the version of
                these Terms in place at the time the dispute arose. Unless we
                indicate otherwise in our notice, your use of the Services
                following any changes to these Terms will constitute your
                acceptance of such changes. If you do not agree to the updated
                Terms, you should terminate your account and stop using the
                Services.
                {"\n\n"}
                18. Other Terms{"\n"}
                a. These Terms and all additional terms incorporated herein
                constitute the entire and exclusive understanding and agreement
                between Zoul and you regarding the Services, and these Terms
                supersede and replace any and all prior oral or written
                understandings or agreements between Zoul and you regarding the
                Services.{"\n\n"}
                b. If any provision or part of a provision of these Terms is
                held unlawful, invalid, or unenforceable, that provision or part
                of the provision will be enforced to the maximum extent
                permissible and is deemed severable from these Terms, and the
                other provisions of these Terms will remain in full force and
                effect.{"\n\n"}
                c. These Terms and all additional terms and related documents,
                including notices and other communications are in the English
                language. Any translations provided are for your convenience
                only.{"\n\n"}
                d. You may not assign or transfer any of your rights or
                obligations under these Terms, by operation of law or otherwise,
                without Zoul’s prior written consent. Any attempt by you to
                assign or transfer your rights or obligations under these Terms,
                without such consent, will be null and of no effect. We may
                freely assign or transfer our rights and obligations under these
                Terms without restriction. Subject to the foregoing, these Terms
                will bind and inure to the benefit of the parties, their
                successors, and permitted assigns.{"\n\n"}
                e. Zoul’s failure to enforce any right or provision of these
                Terms will not be considered a waiver of such right or
                provision. The waiver of any such right or provision will be
                effective only if in writing and signed by a duly authorized
                representative of Zoul. Except as expressly set forth in these
                Terms, the exercise by either party of any of its remedies under
                these Terms will be without prejudice to its other remedies
                under these Terms or otherwise.{"\n\n"}
                f. The section titles in these Terms are for convenience only
                and have no legal or contractual effect.
                {"\n\n"}
                19. Contact Information{"\n"}
                If you have any questions about these Terms, please contact us
                at admin@zoul.app.
              </Text>
            </Block>
            <TouchableOpacity
              style={{
                paddingHorizontal: perfectSize(16),
                marginTop: "7%",

                paddingBottom: 8, // Add some space below the text
              }}
              onPress={() => {
                setIsModalVisible(true);
              }}
            >
              <Text
                regular
                size={responsiveScale(17)}
                color={colors.white}
                style={{ textDecorationLine: "underline" }}
              >
                Delete account
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Block>
      </ImageBackground>
      <ConfirmationModal
        message={"Are you sure you want to delete your account?"}
        cancelDelete={cancelDelete}
        handleCancle={handleCancle}
        isModalVisible={isModalVisible}
        confirmDelete={confirmDelete}
        isLoading={isLoading}
      />
      <ResultModal
        isVisible={isResultModalVisible}
        message={resultMessage}
        isSuccess={isDeleteSuccessful}
        onContinue={async () => {
          setIsResultModalVisible(false);
          dispatch(removeAuthTokenAction());
          await clearAsyncStorage();
          navigation.goBack();
        }}
      />
    </Block>
  );
};
export default TermsAndConditions;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    // height: deviceHeight * 1,
    // width: deviceWidth,
  },
  headerContainer: {
    marginTop: "18%",
    paddingHorizontal: perfectSize(16),
    paddingBottom: perfectSize(24),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#393939E5",
    borderRadius: perfectSize(8),
    paddingVertical: perfectSize(10),
    borderWidth: perfectSize(1),
    borderColor: "#FFFFFF33",
    padding: perfectSize(20),
  },
  modalText: {
    marginBottom: perfectSize(10),
    marginTop: perfectSize(10),
  },
  ContinueButton: {
    backgroundColor: colors.white,
    paddingVertical: perfectSize(10),
    borderRadius: perfectSize(8),
    alignItems: "center",
    marginVertical: perfectSize(10),
    width: "100%",
  },
});
