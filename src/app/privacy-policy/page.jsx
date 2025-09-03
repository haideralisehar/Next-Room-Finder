import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <div>
      <Header />

      <div
        className="term-txt"
        style={{
          maxWidth: "98%",
          margin: "20px 20px",
          padding: "15px",
          border: "1px solid silver",
        }}
      >
        <p
          style={{
            textAlign: "center",
            fontSize: "20px",
            padding: "0px 0px 10px 0px",
            fontWeight: "bold",
          }}
        >
          Privacy And Policy
        </p>
        <hr style={{ color: "grey" }} />

        <p style={{ padding: "10px 0px 5px 0px" }}>
          CityIn Booking respects its users and commits itself to educate them
          about how to deal with their personal information. Hence, we created
          CityIn Booking privacy policy to prove our commitment and show our
          sincere concern for our clients.
        </p>
        <p style={{ padding: "10px 0px 5px 0px" }}>
          InformatiThis page is used to inform visitors regarding our policies
          with the collection, use, and disclosure of Personal Information if
          anyone decided to use our Service.
        </p>
        <p style={{ padding: "10px 0px 5px 0px" }}>
          If you choose to use our Service, then you agree to the collection and
          use of information in relation to this policy. The Personal
          Information that we collect is used for providing and improving the
          Service. We will not use or share your information with anyone except
          as described in this Privacy Policy.
        </p>
        <p style={{ padding: "10px 0px 5px 0px" }}>
          The terms used in this Privacy Policy have the same meanings as in our
          Terms and Conditions, which is accessible at Adhari unless otherwise
          defined in this Privacy Policy.
        </p>
        <hr style={{ color: "#ccc" }} />

        <h1 style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}>
          on Collection and Use
        </h1>
        <p style={{ padding: "0px 0px 10px 0px" }}>
          For a better experience, while using our Service, we may require you
          to provide us with certain personally identifiable information,
          including but not limited to Android Advertising ID. The information
          that we request will be retained by us and used as described in this
          privacy policy.
        </p>
        <hr style={{ color: "#ccc" }} />

        <h1 style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}>
          Cookies
        </h1>
        <p style={{ padding: "0px 0px 10px 0px" }}>
          Cookies are files with a small amount of data that are commonly used
          as anonymous unique identifiers. These are sent to your browser from
          the websites that you visit and are stored on your device's internal
          memory.
        </p>
        <p style={{ padding: "10px 0px 5px 0px" }}>
          This Service does not use these “cookies” explicitly. However, the
          Adhari may use third party code and libraries that use “cookies” to
          collect information and improve their services. You have the option to
          either accept or refuse these cookies and know when a cookie is being
          sent to your device. If you choose to refuse our cookies, you may not
          be able to use some portions of this Service.
        </p>

        <hr style={{ color: "#ccc" }} />

        <h1 style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}>
          Security
        </h1>
        <p style={{ padding: "0px 0px 10px 0px" }}>
          We value your trust in providing us your Personal Information, thus we
          are striving to use commercially acceptable means of protecting it.
          But remember that no method of transmission over the internet, or
          method of electronic storage is 100% secure and reliable, and we
          cannot guarantee its absolute security.
        </p>
        <hr style={{ color: "#ccc" }} />

        <h1 style={{ padding: "20px 0px 10px 0px", fontWeight: "bold" }}>
          Contact Us
        </h1>
        <p style={{ padding: "0px 0px 10px 0px" }}>
          If you have any questions or suggestions about our Privacy Policy, do
          not hesitate to contact us. CityIn Booking -{" "}
          <a
            style={{ color: "#165fd5ff" }}
            href="https://mail.google.com/mail/?view=cm&fs=1&to=sales@cityin.net"
            target="_blank"
          >
            sales@cityin.net
          </a>
        </p>
      </div>

      <Footer />
    </div>
  );
}
