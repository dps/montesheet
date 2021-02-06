import React from "react";
import AuthSection from "./../components/AuthSection";
import { useRouter } from "./../util/router.js";

function AuthPage(props) {
  const router = useRouter();

  return (
    <AuthSection
      bgColor="default"
      size="medium"
      bgImage=""
      bgImageOpacity={1}
      type={router.query.type}
      providers={["google", "facebook", "twitter"]}
      afterAuthPath={router.query.next || "/dashboard"}
    />
  );
}

export default AuthPage;
