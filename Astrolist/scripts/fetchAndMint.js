const { ethers } = require('ethers');

const abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousAdmin',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address',
      },
    ],
    name: 'AdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beacon',
        type: 'address',
      },
    ],
    name: 'BeaconUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'Upgraded',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MINTER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'UPGRADER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'getRoleAdmin',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'hasRole',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'proxiableUUID',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeMint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
];

const provider = new ethers.JsonRpcProvider(
  'https://eth-mainnet.g.alchemy.com/v2/EyJTCH4IKh9oVz4fQiUV8iJDjmIBF6wX'
);
const privateKey =
  '5b0d128cf9cbbc52dc1c8d067171495e2b3ce06b9814c53c4301ae5be8c58265';
const signer = new ethers.Wallet(privateKey, provider);

const oldContract = new ethers.Contract(
  '0xb3c894892183aD8e84798973d5A2CAa542f78F10',
  abi,
  signer
);

async function main() {
  for (let i = 1; i < 400; i++) {
    console.log(
      await oldContract.tokenURI(i),
      ' :',
      await oldContract.ownerOf(i)
    );
  }
}

main();

// 1,  : 0x1D2F71714D19e6298F599ff28109084088CFe547
// 2,  : 0x379D8cf5C13F550Fe0500094016600558B70C525
// 3,  : 0xEcE4395a1efF2299E9152f22ea0a90711887CBA4
// 4,  : 0x9d1091E14Aa55Afc5252FB940e73df84915AE272
// 5,  : 0x6000Cb236CD27ae6f4012bADC2C70Fb368263840
// 6,  : 0x312d738732f869c6E43059BB04179C2eDbfd5e6B
// 7,  : 0x943E0d4867e947c1df72439Cd5FeA94D0DA7A50f
// 8,  : 0xEf8101ae74334Dc9BEd90bBbFf814a084FEC7446
// 9,  : 0xB610BEFc1dff08d52Ee5555516b13a842E4f579D
// 10,  : 0x2a4EAcC096eA4b7D8d32D0ED6c8D731cD067b2d7
// 11,  : 0x02299Dc5da884A1B5Dc1Dc76f1034BB1B05b7F22
// 12,  : 0x7464b98a4Df14bf43A5eeD67E45A3e699CB459ce
// 13,  : 0xbC44a5f0B5849f423e0cAB308472610159654E4B
// 14,  : 0x459c05A6b13CFa6ecf1d72AdB085f7d4A1Dd194c
// 15,  : 0x1DfD11B2583d1Bfc55a517C3BBd1D4872B43f58f
// 16,  : 0x524Fc248Ed5F73Eaf77B4e8d46a9ADfFF1D10144
// 17,  : 0x80c9c7088351C11a789BDb9C9A6fa9ee6f054e33
// 18,  : 0xfa0011F361b7257554E653Ce22Ef83b99168d487
// 19,  : 0x1AD00dCcc1BF84b3418a4f69880C38a966b1d181
// 20,  : 0x35153C3D95856370D755c0d436Be8ca74fC8C881
// 21,  : 0xfa5B482f8e7Ab3fc3fFde70C130B530Dd1E1754f
// 22,  : 0xDd82f9f47f2af05cC307840ED89d4d88fc9FC45f
// 23,  : 0xc287f71a4b126548aBFBf152a2D949E0B033d80e
// 24,  : 0x4066643f04859fa538Ba8EAa906C197c57e4e3e0
// 25,  : 0x30E7eeA5503D8e11b52D283fdc0fF4837b8793cd
// 26,  : 0xAc68d34f099D8078DDfd0E45C3472e766530614A
// 27,  : 0xe18c81D3129EF619D1288D3b967Fe146983a8E55
// 28,  : 0xe8AB9fDdE1475691f7511b3626f2E807FA5a0662
// 29,  : 0x6700051407521d4A6E3BaC77209E902F795Cc996
// 30,  : 0x044Ffe4018944C0e309Ca0bd3e386F4d0190D379
// 31,  : 0x1348a8de46a70F1F4844b147122Ea1f7edb63164
// 32,  : 0x6C8910e4E71dda08C20f4CE300722158064e257e
// 33,  : 0x9Cc066765AdF19d043C665ff1909f3BAA4669D8E
// 34,  : 0x9a223DEe4Ba8652e36b7bac434bc15266E612a2c
// 35,  : 0xA19d373842d47F8f6411336112Cb94237Bd7dbcb
// 36,  : 0x47511b2109ae7d45bEfDD84f06f5aa0727D28eF1
// 37,  : 0xE145B9a26A92Bb8C247B7D580290147976C86C6e
// 38,  : 0xB4Fde51f684eb380f1901723C12EB170d1710f85
// 39,  : 0xAE2CF90F15523c40904d69699827d096B717c9DE
// 40,  : 0xF4F663be9898047e5dD7B05Ce6AfC7e17F7a466c
// 41,  : 0xF3672f42D82f57dB8F3D736252Ac740e22163611
// 42,  : 0x61e2448cB32E5E32D193241da89a02be8CC8046A
// 43,  : 0x561a4D5D24Df36020d721aefeb34B890EEA5Fe5D
// 44,  : 0xCA4fadae67D1E4127b8e7371c7A59FdC3508413B
// 45,  : 0xf4E6232d2f86Bd3399D956b3892d6B1893e1e06E
// 46,  : 0x72279E2284dB05Be687C60e4B644A25BBEe88063
// 47,  : 0x1c8B585529a4A627A92967c37f0A018Fb1cD842F
// 48,  : 0x9FA00D535C3132e536876a27aEd7Dd24dC6B924D
// 49,  : 0xB9D3eA61557Db24fDe7e007dDd2F7B5d533d46D0
// 50,  : 0x1DeA1b5927E9446dA933FfbB42b98a8A7Aab0551
// 51,  : 0xc13F2494Bf4825e123e13Af583886a7dCc2AB472
// 52,  : 0x1b5594D437c04ED8a6D82d8D024A80E439424521
// 53,  : 0x1c8B585529a4A627A92967c37f0A018Fb1cD842F
// 54,  : 0x7448980089845Df8C0ea958d8A70473eb2C0a339
// 55,  : 0xA98A8F17B04CBbde1557d6050d1071067E68367D
// 56,  : 0x75b9dA94cEdCD1010784302ebCE852B4dB353e60
// 57,  : 0xe0c6302300244503fddF9D452DB255B17bA1f752
// 58,  : 0x30A1Cee5E3A1A9AbE6b532bBd834329220BCD735
// 59,  : 0x980670aE511B780105c8776b7b82679b9ee4F7C4
// 60,  : 0xa8F1086810D3dC0E453361567730f1fF02a4FF5A
// 61,  : 0x1A69b7A6347E95804aF8A8c138a0d26d65A3150b
// 62,  : 0xAb7E15dcA2cf21d49E27812F439aC398dc9B37A8
// 63,  : 0xCd8fB68A0859A60b1E54c35C48e7118e657D0c68
// 64,  : 0x7b17bb453C8E1FD78CfF6Ed2e8161f8E56729635
// 65,  : 0x45C6bD8d72B1ce280e3b4e0de084E570Bb5C1e3e
// 66,  : 0x297D6fbC78B767734B8970cd761F3b72f3D1DDd0
// 67,  : 0xBc56B7a45D3240fd58778250b1064bF2b3f82f11
// 68,  : 0x3E32CBFa5bC0e478F9280C308aDB96b320d941c7
// 69,  : 0x8078977878eC1255a3A4eFDa739667f87F26530c
// 70,  : 0x2e212f1ED6Bb1DffEFb9b58D25865cb8c6967937
// 71,  : 0x3239CCF407dC34cf42B6Be08217413b1da9c68a5
// 72,  : 0x7A3F1084e72f7721dC9C8dB52961e9F395449d71
// 73,  : 0x3c477516f39A028826DB45BE1714809ae9c3D608
// 74,  : 0x09c551BF86d83EdDd13Bb88a5BFeCCe88E0b6b04
// 75,  : 0xF99bcE39226ed184Aed2bD65fa864087CcC9A65F
// 76,  : 0xC41070655B12674254A50d7e517A6aa5aE3b3823
// 77,  : 0x473f432851F7B351f90fA397623C43aAeBa2695F
// 78,  : 0xB57f29f8732E59b071BD2a37DdebBEFEae8A84aF
// 79,  : 0x0E3033F9932b6344b6dd9306A69E6f179B479F85
// 80,  : 0xFA35E582e18a00D51170C223552756Fd53bc25A8
// 81,  : 0x807cE865227167fde7E0777d8498837b945390f5
// 82,  : 0xB4bbDB84b89d58953E272fcEa49e19BE966cdE45
// 83,  : 0xfcFE00f77645104c8DEdB1fB744B1969bDa27A72
// 84,  : 0x318a1a98c4817FE96C099E3634822fC408cd0E84
// 85,  : 0x498411bb32776A68536fd1abC91A776564ECfb91
// 86,  : 0x8181af38C1DD2BCbB33c38F0dF5d7CFDcbe7B2f6
// 87,  : 0xa848F90f37f5C4bFf390cD887b96d59b63820ba3
// 88,  : 0x2D9Ea1c5740Aa54D976fC66afDf25B04Cfc8bBa7
// 89,  : 0x09CE440EB65D5245dec25ba59fd36343cdbbE6EB
// 90,  : 0xD9a00a7Ecc505a4F53c4d418cD9219bbc98c031A
// 91,  : 0xc2958e6e2242C8fE1c4323fD6C685Ea0458C056C
// 92,  : 0x8a251e682cA0B06F3D25b9eFE25aD2F5e29ac411
// 93,  : 0x397be8bBCC9831985F15c97eE5695C0b8336D83F
// 94,  : 0xC6EDA82B712DD1cd8A602d6F0f3d30A733ADB63b
// 95,  : 0xe97c3DEe40405D35560746d7e3dbEB152d164BB0
// 96,  : 0xA83819949c8c183e8cE8CEe4158879949588af33
// 97,  : 0x4Df0CfCB9dcd97B4EAeAe378Ea09C9b39eD51f98
// 98,  : 0xacd3529A016F82163FDE058754d1f7780F1B818d
// 99,  : 0xB866F736916FdEeFEAB1bcc6C2F0FFDC4123e6Ef
// 100,  : 0xA1981ed8864d1E89aB3E0624f7BA1b201745794c
// 101,  : 0x90177AebdFe318d9581536CB33395bF55e37a647
// 102,  : 0xb7b2261456c4f01E2D0f4BFC4E7BBD59b2a84527
// 103,  : 0xd64B01c2b6026C0851cF5ef36808729b52a9Aa66
// 104,  : 0xbB7422f8f671992fa552289CBE542946b491DCd8
// 105,  : 0xFC27F64B651713Cfa34c596be2f6f7B48375F045
// 106,  : 0xd61759C6a9fEB453699c91D2Be55134cc6670Ee0
// 107,  : 0x37098F7C119137EA4C08aC1D3f9423CF33c979f7
// 108,  : 0x77377112c81042BF1Ea5064A6A2da5fED4A54493
// 109,  : 0x07b27a7d43177c066BD8Af13B0F5B51F360a5C33
// 110,  : 0x7f4E669Fd1F82F1057F0E735bBc195E25ac966df
// 111,  : 0xBE2eE7416674962a203454754b77496E8d5D1f80
// 112,  : 0xD64304D96B8Af808E940a75d8e5C5dB664AE54c1
// 113,  : 0xBf9B3B50a8D66996f481CB9f2978B13b49c79169
// 114,  : 0xE584fF7992B8574DBD83bE8721a2120b1BEf3aFC
// 115,  : 0xaB9EA999c01443D3dce8cc73BF7c779A28AC2e62
// 116,  : 0xf2b9aE24bB32f78a21B811f436C0CFb16D1B4CC9
// 117,  : 0x6B436Aa87dc2a910F770946447d0E2CBA59C27C3
// 118,  : 0x7f183a1115F6C9e887926AF1bb64963439cF0311
// 119,  : 0xbDc121cb124BD62c61FFe0954ab9420Dc3d083a1
// 120,  : 0xB212618F58dDc12C07A87b7aB715dB167085B72c
// 121,  : 0x9698fe5409dbE10Cd8A277E7a6f17fDa2501e3aB
// 122,  : 0x1736F72bA6c8F84f951B239FC638cBfa8725D434
// 123,  : 0x5c80B327E5f4d00A5E78Df63D2F7545bd6A49415
// 124,  : 0xA6CF417027Cb328d3b133932f0E4da39Aa455ff8
// 125,  : 0x54b09Ed9347Fa358C3Af4fd3f243A25B4B7AacD8
// 126,  : 0xB3807F913c53A6d72B5B97E3303C58CB47Cd5D32

// 0x1d2f71714d19e6298f599ff28109084088cfe547;
// 0x379d8cf5c13f550fe0500094016600558b70c525;
// 0xece4395a1eff2299e9152f22ea0a90711887cba4;
// 0x9d1091e14aa55afc5252fb940e73df84915ae272;
// 0x6000cb236cd27ae6f4012badc2c70fb368263840;
// 0x312d738732f869c6e43059bb04179c2edbfd5e6b;
// 0x943e0d4867e947c1df72439cd5fea94d0da7a50f;
// 0xef8101ae74334dc9bed90bbbff814a084fec7446;
// 0xb610befc1dff08d52ee5555516b13a842e4f579d;
// 0x2a4eacc096ea4b7d8d32d0ed6c8d731cd067b2d7;
// 0x02299dc5da884a1b5dc1dc76f1034bb1b05b7f22;
// 0x7464b98a4df14bf43a5eed67e45a3e699cb459ce;
// 0xbc44a5f0b5849f423e0cab308472610159654e4b;
// 0x459c05a6b13cfa6ecf1d72adb085f7d4a1dd194c;
// 0x1dfd11b2583d1bfc55a517c3bbd1d4872b43f58f;
// 0x524fc248ed5f73eaf77b4e8d46a9adfff1d10144;
// 0x80c9c7088351c11a789bdb9c9a6fa9ee6f054e33;
// 0xfa0011f361b7257554e653ce22ef83b99168d487;
// 0x1ad00dccc1bf84b3418a4f69880c38a966b1d181;
// 0x35153c3d95856370d755c0d436be8ca74fc8c881;
// 0xfa5b482f8e7ab3fc3ffde70c130b530dd1e1754f;
// 0xdd82f9f47f2af05cc307840ed89d4d88fc9fc45f;
// 0xc287f71a4b126548abfbf152a2d949e0b033d80e;
// 0x4066643f04859fa538ba8eaa906c197c57e4e3e0;
// 0x30e7eea5503d8e11b52d283fdc0ff4837b8793cd;
// 0xac68d34f099d8078ddfd0e45c3472e766530614a;
// 0xe18c81d3129ef619d1288d3b967fe146983a8e55;
// 0xe8ab9fdde1475691f7511b3626f2e807fa5a0662;
// 0x6700051407521d4a6e3bac77209e902f795cc996;
// 0x044ffe4018944c0e309ca0bd3e386f4d0190d379;
// 0x1348a8de46a70f1f4844b147122ea1f7edb63164;
// 0x6c8910e4e71dda08c20f4ce300722158064e257e;
// 0x9cc066765adf19d043c665ff1909f3baa4669d8e;
// 0x9a223dee4ba8652e36b7bac434bc15266e612a2c;
// 0xa19d373842d47f8f6411336112cb94237bd7dbcb;
// 0x47511b2109ae7d45befdd84f06f5aa0727d28ef1;
// 0xe145b9a26a92bb8c247b7d580290147976c86c6e;
// 0xb4fde51f684eb380f1901723c12eb170d1710f85;
// 0xae2cf90f15523c40904d69699827d096b717c9de;
// 0xf4f663be9898047e5dd7b05ce6afc7e17f7a466c;
// 0xf3672f42d82f57db8f3d736252ac740e22163611;
// 0x61e2448cb32e5e32d193241da89a02be8cc8046a;
// 0x561a4d5d24df36020d721aefeb34b890eea5fe5d;
// 0xca4fadae67d1e4127b8e7371c7a59fdc3508413b;
// 0xf4e6232d2f86bd3399d956b3892d6b1893e1e06e;
// 0x72279e2284db05be687c60e4b644a25bbee88063;
// 0x1c8b585529a4a627a92967c37f0a018fb1cd842f;
// 0x9fa00d535c3132e536876a27aed7dd24dc6b924d;
// 0xb9d3ea61557db24fde7e007ddd2f7b5d533d46d0;
// 0x1dea1b5927e9446da933ffbb42b98a8a7aab0551;
// 0xc13f2494bf4825e123e13af583886a7dcc2ab472;
// 0x1b5594d437c04ed8a6d82d8d024a80e439424521;
// 0x1c8b585529a4a627a92967c37f0a018fb1cd842f;
// 0x7448980089845df8c0ea958d8a70473eb2c0a339;
// 0xa98a8f17b04cbbde1557d6050d1071067e68367d;
// 0x75b9da94cedcd1010784302ebce852b4db353e60;
// 0xe0c6302300244503fddf9d452db255b17ba1f752;
// 0x30a1cee5e3a1a9abe6b532bbd834329220bcd735;
// 0x980670ae511b780105c8776b7b82679b9ee4f7c4;
// 0xa8f1086810d3dc0e453361567730f1ff02a4ff5a;
// 0x1a69b7a6347e95804af8a8c138a0d26d65a3150b;
// 0xab7e15dca2cf21d49e27812f439ac398dc9b37a8;
// 0xcd8fb68a0859a60b1e54c35c48e7118e657d0c68;
// 0x7b17bb453c8e1fd78cff6ed2e8161f8e56729635;
// 0x45c6bd8d72b1ce280e3b4e0de084e570bb5c1e3e;
// 0x297d6fbc78b767734b8970cd761f3b72f3d1ddd0;
// 0xbc56b7a45d3240fd58778250b1064bf2b3f82f11;
// 0x3e32cbfa5bc0e478f9280c308adb96b320d941c7;
// 0x8078977878ec1255a3a4efda739667f87f26530c;
// 0x2e212f1ed6bb1dffefb9b58d25865cb8c6967937;
// 0x3239ccf407dc34cf42b6be08217413b1da9c68a5;
// 0x7a3f1084e72f7721dc9c8db52961e9f395449d71;
// 0x3c477516f39a028826db45be1714809ae9c3d608;
// 0x09c551bf86d83eddd13bb88a5bfecce88e0b6b04;
// 0xf99bce39226ed184aed2bd65fa864087ccc9a65f;
// 0xc41070655b12674254a50d7e517a6aa5ae3b3823;
// 0x473f432851f7b351f90fa397623c43aaeba2695f;
// 0xb57f29f8732e59b071bd2a37ddebbefeae8a84af;
// 0x0e3033f9932b6344b6dd9306a69e6f179b479f85;
// 0xfa35e582e18a00d51170c223552756fd53bc25a8;
// 0x807ce865227167fde7e0777d8498837b945390f5;
// 0xb4bbdb84b89d58953e272fcea49e19be966cde45;
// 0xfcfe00f77645104c8dedb1fb744b1969bda27a72;
// 0x318a1a98c4817fe96c099e3634822fc408cd0e84;
// 0x498411bb32776a68536fd1abc91a776564ecfb91;
// 0x8181af38c1dd2bcbb33c38f0df5d7cfdcbe7b2f6;
// 0xa848f90f37f5c4bff390cd887b96d59b63820ba3;
// 0x2d9ea1c5740aa54d976fc66afdf25b04cfc8bba7;
// 0x09ce440eb65d5245dec25ba59fd36343cdbbe6eb;
// 0xd9a00a7ecc505a4f53c4d418cd9219bbc98c031a;
// 0xc2958e6e2242c8fe1c4323fd6c685ea0458c056c;
// 0x8a251e682ca0b06f3d25b9efe25ad2f5e29ac411;
// 0x397be8bbcc9831985f15c97ee5695c0b8336d83f;
// 0xc6eda82b712dd1cd8a602d6f0f3d30a733adb63b;
// 0xe97c3dee40405d35560746d7e3dbeb152d164bb0;
// 0xa83819949c8c183e8ce8cee4158879949588af33;
// 0x4df0cfcb9dcd97b4eaeae378ea09c9b39ed51f98;
// 0xacd3529a016f82163fde058754d1f7780f1b818d;
// 0xb866f736916fdeefeab1bcc6c2f0ffdc4123e6ef;
// 0xa1981ed8864d1e89ab3e0624f7ba1b201745794c;
// 0x90177aebdfe318d9581536cb33395bf55e37a647;
// 0xb7b2261456c4f01e2d0f4bfc4e7bbd59b2a84527;
// 0xd64b01c2b6026c0851cf5ef36808729b52a9aa66;
// 0xbb7422f8f671992fa552289cbe542946b491dcd8;
// 0xfc27f64b651713cfa34c596be2f6f7b48375f045;
// 0xd61759c6a9feb453699c91d2be55134cc6670ee0;
// 0x37098f7c119137ea4c08ac1d3f9423cf33c979f7;
// 0x77377112c81042bf1ea5064a6a2da5fed4a54493;
// 0x07b27a7d43177c066bd8af13b0f5b51f360a5c33;
// 0x7f4e669fd1f82f1057f0e735bbc195e25ac966df;
// 0xbe2ee7416674962a203454754b77496e8d5d1f80;
// 0xd64304d96b8af808e940a75d8e5c5db664ae54c1;
// 0xbf9b3b50a8d66996f481cb9f2978b13b49c79169;
// 0xe584ff7992b8574dbd83be8721a2120b1bef3afc;
// 0xab9ea999c01443d3dce8cc73bf7c779a28ac2e62;
// 0xf2b9ae24bb32f78a21b811f436c0cfb16d1b4cc9;
// 0x6b436aa87dc2a910f770946447d0e2cba59c27c3;
// 0x7f183a1115f6c9e887926af1bb64963439cf0311;
// 0xbdc121cb124bd62c61ffe0954ab9420dc3d083a1;
// 0xb212618f58ddc12c07a87b7ab715db167085b72c;
// 0x9698fe5409dbe10cd8a277e7a6f17fda2501e3ab;
// 0x1736f72ba6c8f84f951b239fc638cbfa8725d434;
// 0x5c80b327e5f4d00a5e78df63d2f7545bd6a49415;
// 0xa6cf417027cb328d3b133932f0e4da39aa455ff8;
// 0x54b09ed9347fa358c3af4fd3f243a25b4b7aacd8;
// 0xb3807f913c53a6d72b5b97e3303c58cb47cd5d32;
