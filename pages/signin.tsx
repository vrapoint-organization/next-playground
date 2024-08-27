import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      suc: false,
    });
    console.log("Fail result : ", { result });

    if (result?.ok) {
      router.push("/checksignin");
      return;
    }

    setError(result.error);
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button
          onClick={async (e) => {
            e.preventDefault();
            const result = await signIn("credentials", {
              redirect: false,
              email,
              password,
              suc: true,
            });

            console.log("Suc result : ", { result });

            if (result?.error) {
              setError(result.error);
            } else {
              // Redirect to the dashboard or home page
              //   window.location.href = "/checksignin";
              router.push("/checksignin");
            }
          }}
        >
          Sign In (success)
        </button>
        <button type="submit">Sign In (fail)</button>
      </form>
    </div>
  );
}
