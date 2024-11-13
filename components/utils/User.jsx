import Image from "next/image";
import Link from "next/link";
import { FaUser } from "react-icons/fa";

const UserDetails = ({ user, children }) => {
  return (
    <>
      <div className="flex flex-col justify-center w-full my-2">
        <div className="flex justify-between gap-5 items-center p-2">
          <Link href={`/profile/${user.username}`}>
            <div className="flex gap-3">
              {user.image ? (
                <div className="overflow-hidden w-[70px] h-[70px] rounded-full">
                  <Image
                    src={user.image}
                    width={70}
                    height={70}
                    alt={`${user.firstname} ${user.lastname}`}
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <FaUser size={60} />
              )}
              <div>
                <h2 className="text-lg font-bold">{`${user.firstname} ${user.lastname}`}</h2>
                <h3 className="text-md text-muted-foreground">
                  @{user.username}
                </h3>
              </div>
            </div>
          </Link>
          <div className="flex flex-col items-start">
            <div className="flex justify-end items-center">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetails;
