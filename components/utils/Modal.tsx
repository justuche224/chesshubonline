import { User } from "@prisma/client";
import CardWrapper from "../auth/CardWrapper";

export const AccountCreatedModal = () => {
  return (
    <section className="min-h-screen w-full fixed left-0 top-0 bg-[#0000007e] z-[997] flex flex-col justify-center items-center backdrop-blur-lg">
      <CardWrapper
        headerLabel="Account Created"
        backButtonLable="Back to login"
        backButtonHref="/auth/login"
      >
        <h1>
          A verification link has been sent to your email. Please check your
          inbox to activate your account.
        </h1>
      </CardWrapper>
    </section>
  );
};

export const PasswordResetModal = () => {
  return (
    <section className="min-h-screen w-full fixed left-0 top-0 bg-[#0000007e] z-[997] flex flex-col justify-center items-center backdrop-blur-lg">
      <CardWrapper
        headerLabel="Link sent!"
        backButtonLable="Back to login"
        backButtonHref="/auth/login"
      >
        <h1>
          A link to reset your password has been sent to your email. Please
          check your inbox to reset your password.
        </h1>
      </CardWrapper>
    </section>
  );
};

export const PasswordResetSuccessfulModal = () => {
  return (
    <section className="min-h-screen w-full fixed left-0 top-0 bg-[#0000007e] z-[997] flex flex-col justify-center items-center backdrop-blur-lg">
      <CardWrapper
        headerLabel="Password Changed Successfuly!"
        backButtonLable="Back to login"
        backButtonHref="/auth/login"
      >
        <h1>You&apos;ve Successfuly updated your password!</h1>
      </CardWrapper>
    </section>
  );
};

type NewGameModalProps = {
  toggleNewGameModal: () => void;
  users: User[];
};

export const NewGameModal = ({
  toggleNewGameModal,
  users,
}: NewGameModalProps) => {
  return (
    <section
      onClick={toggleNewGameModal}
      className="min-h-screen w-full fixed left-0 top-0 bg-[#0000007e] z-[997] flex flex-col justify-center items-center backdrop-blur-lg"
    >
      <div onClick={(e) => e.stopPropagation()}>
        <CardWrapper
          headerLabel="Start New Game"
          backButtonLable=""
          backButtonHref=""
        >
          <h1>Select Player</h1>
        </CardWrapper>
        <div className="bg-white p-6 rounded shadow-md w-[300px]">
          <h1 className="text-xl font-bold mb-4">Select Player</h1>
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id} className="flex justify-between items-center">
                <span>{user.username}</span>
                <button className="text-blue-500 hover:underline">
                  Select
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={toggleNewGameModal}
            className="mt-4 w-full bg-red-500 text-white py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
};
