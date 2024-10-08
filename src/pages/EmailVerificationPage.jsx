import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/authStore";
import SpinnerComponent from "../components/Spinner";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
  const { user } = useAuthStore();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { verifyEmail, isLoading, error } = useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];
    //Handle pasted value
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // Focus on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      //Move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const VerificationCode = code.join("");
    try {
      await verifyEmail(VerificationCode);
      navigate("/");
      toast.success("Email Verified Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new SubmitEvent("submit"));
    }
  }, [code]);

  return (
    <>
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
        <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <Link to="/">
                <img
                  alt="Your Company"
                  src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                  className="mx-auto h-10 w-auto"
                />
              </Link>
              <div className="font-semibold text-3xl">
                <p>Email Verification</p>
              </div>
              <div className="flex flex-row text-sm font-medium text-gray-400">
                <p>We have sent a code to your email {user?.email}</p>
              </div>
            </div>

            <div>
              <form action="" method="post" onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-16">
                  <div className="flex justify-space-between items-center mx-auto">
                    {code.map((digit, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center justify-center text-center space-y-2 m-1"
                      >
                        <input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          name="code"
                          maxLength={6}
                          value={digit}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-16 h-16 flex flex-col items-center justify-center text-base text-center font-bold px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        />
                      </div>
                    ))}
                  </div>
                  {error && (
                    <p className="text-red-500 font-semibold text-center mt-2">
                      {error}
                    </p>
                  )}
                  <div className="flex flex-col space-y-5">
                    <div>
                      <button
                        className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-md shadow-sm"
                        disabled={isLoading || code.some((digit) => !digit)}
                      >
                        {isLoading ? <SpinnerComponent /> : "Verify Email"}
                      </button>
                    </div>

                    <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                      <p>Didn&apos;t recieve code?</p>{" "}
                      <a
                        className="flex flex-row items-center text-blue-600"
                        href="http://"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Resend
                      </a>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailVerificationPage;
