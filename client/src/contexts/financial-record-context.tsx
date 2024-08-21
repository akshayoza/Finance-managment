import { useUser } from "@clerk/clerk-react";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export interface FinancialRecord {
  _id?: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

interface FinancialRecordContextType {
  records: FinancialRecord[];
  addRecord: (record: FinancialRecord) => void;
  // Uncomment and fix these if you implement them
  UpdateRecord: (id: string, newRecord: FinancialRecord) => void;
  deleteRecord: (id: string) => void;
}

export const FinancialRecordContext = createContext<
  FinancialRecordContextType | undefined
>(undefined);

export const FinancialRecordsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const { user } = useUser();
  const fetchRecords = async () => {
    if (!user) return;
    const response = await fetch(
      `http://localhost:3009/financial-records/getAllByUserID/${user?.id}`
    );
    if (response.ok) {
      const records = await response.json();
      console.log(records);
      setRecords(records);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);
  const addRecord = async (record: FinancialRecord) => {
    try {
      const response = await fetch("http://localhost:3009/financial-records", {
        method: "POST",
        body: JSON.stringify(record),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) => [...prev, newRecord]);
      } else {
        console.error("Failed to add record:", await response.text());
      }
    } catch (err) {
      console.error("Error adding record:", err);
    }
  };

  const UpdateRecord = async (id: string, newRecord: FinancialRecord) => {
    try {
      const response = await fetch(`http://localhost:3009/financial-records/${id}`, {
        method: "PUT",
        body: JSON.stringify(newRecord),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const updatedRecord = await response.json();
        setRecords((prevRecords) =>
          prevRecords.map((record) => (record._id === id ? updatedRecord : record))
        );
      } else {
        console.error("Failed to update record:", await response.text());
      }
    } catch (err) {
      console.error("Error updating record:", err);
    }
  };
  
  const deleteRecord = async(id:string) =>{
  try {
    const response = await fetch(`http://localhost:3009/financial-records/${id}`, {
      method: "DELETE",
      
    });
    if (response.ok) {
      const deleteRecord = await response.json();
      setRecords((prev) => prev.filter((record)=>record._id !== deleteRecord._id));
    } else {
      console.error("Failed to add record:", await response.text());
    }
  } catch (err) {
    console.error("Error adding record:", err);
  }
};

  return (
    <FinancialRecordContext.Provider
      value={{ records, addRecord, UpdateRecord,deleteRecord }}
    >
      {children}
    </FinancialRecordContext.Provider>
  );
};

export const useFinancialRecords = (): FinancialRecordContextType => {
  const context = useContext(FinancialRecordContext);
  if (context === undefined) {
    throw new Error(
      "useFinancialRecords must be used within a FinancialRecordsProvider"
    );
  }
  return context;
};
