import { Check, X } from "lucide-react";

const PasswordCriteria = ({ password }) => {
  const criteria = [
    { label: "Contains at least 8 characters", isValid: password.length >= 8 },
    {
      label: "Contains at least 1 uppercase letter",
      isValid: /[A-Z]/.test(password),
    },
    {
      label: "Contains at least 1 lowercase letter",
      isValid: /[a-z]/.test(password),
    },
    { label: "Contains at least 1 number", isValid: /[0-9]/.test(password) },
    {
      label: "Contains at least 1 special character",
      isValid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    <div className="mt-2 space-y-1">
      {criteria.map((item) => (
        <div key={item.label} className="flex items-center text-xs">
          {item.isValid ? (
            <Check className=" size-4 text-green-500 mr-2" />
          ) : (
            <X className="size-4 text-red-500 mr-2" />
          )}
          <span className={item.isValid ? "text-green-500" : "text-red-500"}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass)) strength++;
    return strength;
  };
  const strength = getStrength(password);

  const getColor = (strength) => {
    if (strength == 0) return "bg-red-500";
    if (strength === 1) return "bg-orange-400";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-green-400";
    return "bg-green-500";
  };

  const getStrengthText = (strength) => {
    if (strength == 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="mt-2 ">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">Password Strength</span>
        <span className="text-xs text-gray-500">
          {getStrengthText(strength)}
        </span>
      </div>
      <div className="flex space-x-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1 w-1/4 rounded-full transition-color duration-300 
                ${index < strength ? getColor(strength) : "bg-gray-600"}
                `}
          />
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
};

export default PasswordStrengthMeter;
