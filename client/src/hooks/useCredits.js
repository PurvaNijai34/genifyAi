import { useUser } from "@clerk/react";

const useCredits = (credits) => {
  const { user } = useUser();

  const isPremium = user?.publicMetadata?.plan === "premium";

  const isDisabled = !isPremium && credits === 0;

  return {
    isPremium,
    isDisabled,
  };
};

export default useCredits;