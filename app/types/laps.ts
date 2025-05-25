/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/laps.json`.
 */
export type Laps = {
  "address": "BDThdpgR8TRV1iUBBVUu7qHCmsgHvqydxqUN6BXQhghx",
  "metadata": {
    "name": "laps",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "lock",
      "discriminator": [
        21,
        19,
        208,
        43,
        237,
        62,
        255,
        87
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "stateAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  97,
                  112,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "delay",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "unlock",
      "discriminator": [
        101,
        155,
        40,
        21,
        158,
        189,
        56,
        203
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "stateAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  97,
                  112,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "lockingData",
      "discriminator": [
        84,
        125,
        62,
        85,
        200,
        171,
        167,
        179
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "alreadyLocked",
      "msg": "Some funds are already locked"
    },
    {
      "code": 6001,
      "name": "earlyUnlock",
      "msg": "Cannot withdraw before unlock time"
    }
  ],
  "types": [
    {
      "name": "lockingData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "unlockTimestamp",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
