import { IMove } from "../components/RPSMoves/PickMove";

export const generateSalt = () => {
  return window.crypto.getRandomValues(new Uint8Array(8)).join("");
};

export const contractsStorageKey = "contracts";

export const getLocalStorageCreatedContracts = (storageKey: string) => {
  const existingContracts = JSON.parse(
    localStorage.getItem(storageKey) || "{}"
  );
  return {
    contractsData: existingContracts,
  };
};

export const saveSaltToLocalStorage = ({
  contractAddress,
  salt,
  move,
  account,
}: {
  contractAddress: string;
  salt: string;
  move: IMove;
  account: string;
}) => {
  const existingContracts = JSON.parse(
    localStorage.getItem(contractsStorageKey) || "{}"
  );
  localStorage.setItem(
    contractsStorageKey,
    JSON.stringify({
      ...existingContracts,
      [contractAddress]: { salt, move, account },
    })
  );
};

export const getSaltFromLocalStorage = (contractAddress: string) => {
  const existingContracts = JSON.parse(
    localStorage.getItem(contractsStorageKey) || "{}"
  );
  return existingContracts?.[contractAddress]?.salt || null;
};

export const joinedContractsLocalStorageKey = "joinedContracts";

export const createJoinedLocalStorageContract = ({
  contractAddress,
  move,
  account,
}: {
  contractAddress: string;
  move: IMove;
  account: string;
}) => {
  const existingjJoinedContracts = JSON.parse(
    localStorage.getItem(joinedContractsLocalStorageKey) || "{}"
  );
  existingjJoinedContracts[contractAddress] = {
    move,
    account,
  };
  localStorage.setItem(
    joinedContractsLocalStorageKey,
    JSON.stringify(existingjJoinedContracts)
  );
};

export const deleteContractFromLocalStorage = (contractAddress: string, localStorageKey: string) => {
  const { contractsData } =
    getLocalStorageCreatedContracts(localStorageKey);
  // @ts-ignore
  delete contractsData[contractAddress];
  localStorage.setItem(
    localStorageKey,
    JSON.stringify(contractsData)
  );
  return contractsData
};
