export declare type StakingProgram = {
    version: "0.0.0";
    name: "jungle";
    instructions: [
        {
            name: "initializeJungle";
            accounts: [
                {
                    name: "jungleKey";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "jungle";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "escrow";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "mint";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "rewardsAccount";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "owner";
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: "tokenProgram";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "rent";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "systemProgram";
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: "bumps";
                    type: {
                        defined: "InitializeJungleBumps";
                    };
                },
                {
                    name: "maxRarity";
                    type: "u64";
                },
                {
                    name: "maxMultiplier";
                    type: "u64";
                },
                {
                    name: "baseWeeklyEmissions";
                    type: "u64";
                },
                {
                    name: "start";
                    type: "i64";
                },
                {
                    name: "root";
                    type: {
                        array: ["u8", 32];
                    };
                }
            ];
        },
        {
            name: "setJungle";
            accounts: [
                {
                    name: "jungle";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "owner";
                    isMut: false;
                    isSigner: true;
                },
                {
                    name: "newOwner";
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: "maxRarity";
                    type: "u64";
                },
                {
                    name: "maxMultiplier";
                    type: "u64";
                },
                {
                    name: "baseWeeklyEmissions";
                    type: "u64";
                },
                {
                    name: "start";
                    type: "i64";
                },
                {
                    name: "root";
                    type: {
                        array: ["u8", 32];
                    };
                }
            ];
        },
        {
            name: "withdrawRewards";
            accounts: [
                {
                    name: "jungle";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "escrow";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "mint";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "rewardsAccount";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "owner";
                    isMut: false;
                    isSigner: true;
                },
                {
                    name: "ownerAccount";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "tokenProgram";
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: "amount";
                    type: "u64";
                }
            ];
        },
        {
            name: "stakeAnimal";
            accounts: [
                {
                    name: "jungle";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "escrow";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "animal";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "staker";
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: "mint";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "stakerAccount";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "depositAccount";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "tokenProgram";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "clock";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "rent";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "systemProgram";
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: "bumps";
                    type: {
                        defined: "StakeAnimalBumps";
                    };
                },
                {
                    name: "proof";
                    type: {
                        vec: {
                            array: ["u8", 32];
                        };
                    };
                },
                {
                    name: "emissionsPerDay";
                    type: "u64";
                },
                {
                    name: "faction";
                    type: "u64";
                }
            ];
        },
        {
            name: "unstakeAnimal";
            accounts: [
                {
                    name: "jungle";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "escrow";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "animal";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "staker";
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: "mint";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "stakerAccount";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "depositAccount";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "tokenProgram";
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: "claimStaking";
            accounts: [
                {
                    name: "jungle";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "escrow";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "animal";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "staker";
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: "mint";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "stakerAccount";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "rewardsAccount";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "tokenProgram";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "clock";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "rent";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "systemProgram";
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: "initAccount";
            accounts: [
                {
                    name: "staker";
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: "mint";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "stakerAccount";
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: "tokenProgram";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "rent";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "systemProgram";
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        }
    ];
    accounts: [
        {
            name: "jungle";
            type: {
                kind: "struct";
                fields: [
                    {
                        name: "key";
                        type: "publicKey";
                    },
                    {
                        name: "owner";
                        type: "publicKey";
                    },
                    {
                        name: "bumps";
                        type: {
                            defined: "InitializeJungleBumps";
                        };
                    },
                    {
                        name: "escrow";
                        type: "publicKey";
                    },
                    {
                        name: "mint";
                        type: "publicKey";
                    },
                    {
                        name: "rewardsAccount";
                        type: "publicKey";
                    },
                    {
                        name: "animalsStaked";
                        type: "u64";
                    },
                    {
                        name: "maximumRarity";
                        type: "u64";
                    },
                    {
                        name: "maximumRarityMultiplier";
                        type: "u64";
                    },
                    {
                        name: "baseWeeklyEmissions";
                        type: "u64";
                    },
                    {
                        name: "start";
                        type: "i64";
                    },
                    {
                        name: "root";
                        type: {
                            array: ["u8", 32];
                        };
                    }
                ];
            };
        },
        {
            name: "animal";
            type: {
                kind: "struct";
                fields: [
                    {
                        name: "bumps";
                        type: {
                            defined: "StakeAnimalBumps";
                        };
                    },
                    {
                        name: "mint";
                        type: "publicKey";
                    },
                    {
                        name: "staker";
                        type: "publicKey";
                    },
                    {
                        name: "emissionsPerDay";
                        type: "u64";
                    },
                    {
                        name: "faction";
                        type: "u8";
                    },
                    {
                        name: "lastClaim";
                        type: "i64";
                    }
                ];
            };
        }
    ];
    types: [
        {
            name: "InitializeJungleBumps";
            type: {
                kind: "struct";
                fields: [
                    {
                        name: "jungle";
                        type: "u8";
                    },
                    {
                        name: "escrow";
                        type: "u8";
                    },
                    {
                        name: "rewards";
                        type: "u8";
                    }
                ];
            };
        },
        {
            name: "StakeAnimalBumps";
            type: {
                kind: "struct";
                fields: [
                    {
                        name: "animal";
                        type: "u8";
                    },
                    {
                        name: "deposit";
                        type: "u8";
                    }
                ];
            };
        }
    ];
    errors: [
        {
            code: 300;
            name: "InvalidMultiplier";
            msg: "Invalid multiplier, must be greater than 10000";
        },
        {
            code: 301;
            name: "TooEarly";
            msg: "Too early to stake";
        },
        {
            code: 302;
            name: "InvalidProof";
            msg: "Merkle proof is invalid";
        }
    ];
    metadata: {
        address: "1rRJRs5bN9WmfLGD5TXdy763Y43GssV3ox46aDz1eci";
    };
};
export declare const StakingProgramIDL: StakingProgram;
