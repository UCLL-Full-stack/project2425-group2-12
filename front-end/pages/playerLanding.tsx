import { withAuth } from "@/components/withAuth";
import { useRouter } from "next/router";

const PlayerLanding: React.FC = () => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Welcome, Player!</h1>
      <p>Select an action to proceed:</p>
      <div className="space-y-4 mt-4">
        <button
          onClick={() => handleNavigate("/teamManagement")}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-6 rounded"
        >
          Manage Your Team
        </button>
        <button
          onClick={() => handleNavigate("/participation")}
          className="bg-green-500 hover:bg-green-700 text-white py-2 px-6 rounded"
        >
          View Participation
        </button>
      </div>
    </div>
  );
};

export default withAuth(PlayerLanding, ["player"]);
