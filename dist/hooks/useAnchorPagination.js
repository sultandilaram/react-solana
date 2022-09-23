import React from "react";
export default function useAnchorPagination(program, accountName, filters = [], dataPerPage = 10) {
  const accountNameIDL = React.useMemo(() => {
    if (!program.idl.accounts?.length) throw new Error("No accounts found in IDL");
    return program.idl.accounts.map(a => a.name).find(a => a === accountName);
  }, [program, accountName]);
  const [accounts, setAccounts] = React.useState([]);
  const [data, setData] = React.useState(() => {
    return new Array(Math.ceil(accounts.length / dataPerPage)).fill([]);
  });
  React.useEffect(() => {
    if (!accountNameIDL) throw new Error(` '${accountName}' account not found in IDL`);

    (async () => {
      const accounts = (await program.provider.connection.getProgramAccounts(program.programId, {
        dataSlice: {
          offset: 0,
          length: 0
        },
        filters: [{
          dataSize: 8 + program.account[accountNameIDL].size
        }, ...filters]
      })).map(a => a.pubkey);
      setAccounts(accounts);
    })();
  }, [accountNameIDL, filters, program]);
  const fetchPage = React.useCallback(async page => {
    if (!accountNameIDL) throw new Error(` '${accountName}' account not found in IDL`);
    const start = page * dataPerPage;
    const end = start + dataPerPage;
    const pageAccounts = accounts.slice(start, end);
    const pageData = (await program.account[accountNameIDL].fetchMultiple(pageAccounts)).filter(a => a !== null);
    setData(d => {
      const newData = [...d];
      newData[page] = pageData;
      return newData;
    });
    return pageData;
  }, [accounts, accountNameIDL, dataPerPage, program]);
  const getPage = React.useCallback(async page => {
    if (page < 0 || page >= data.length) return [];

    if (data[page].length === 0) {
      return await fetchPage(page);
    }

    return data[page];
  }, [data, fetchPage]);
  return {
    accounts,
    data,
    getPage
  };
}