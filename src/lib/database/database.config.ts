import type { StoreDefinitionType } from "@cloudparker/easy-idb";

export const stores: StoreDefinitionType[] = [
    { name: 'orgs', primaryKey: '_id', indexes: ['_uatdt'] },
    {
        name: 'users', primaryKey: '_onid',
        indexes: [
            { keyPath: 'oid' },
            { keyPath: ['oid', 'type'] },
            { keyPath: ['oid', 'type', 'subtype'] },
            { keyPath: ['oid', 'type', 'master.route',] },
            { keyPath: ['oid', '_uatdt'] },
            { keyPath: ['oid', '_id'] },
        ],
    },
    {
        name: 'roles', primaryKey: '_onid',
        indexes: [
            { keyPath: 'oid' },
            { keyPath: ['oid', '_uatdt'] },
            { keyPath: ['oid', '_id'] },
        ],
    },
    { name: 'cache', primaryKey: '_key', },
    {
        name: 'attrs', primaryKey: '_onid',
        indexes: [
            { keyPath: 'oid' },
            { keyPath: ['oid', '_uatdt'] },
            { keyPath: ['oid', '_id'] },
            { keyPath: ['oid', 'type',] },
            { keyPath: ['oid', 'parent'] },
            { keyPath: ['oid', 'type', 'parent'] },
        ],
    },
    {
        name: 'files', primaryKey: '_onid',
        indexes: [
            { keyPath: 'oid' },
            { keyPath: ['oid', '_uatdt'] },
            { keyPath: ['oid', '_id'] },
        ],
    },
    {
        name: 'docs', primaryKey: '_onid',
        indexes: [
            { keyPath: 'oid' },
            { keyPath: ['oid', '_uatdt'] },
            { keyPath: ['oid', 'type', '_uatdt'] },
            { keyPath: ['oid', 'type', 'uid', '_uatdt'] },
            { keyPath: ['oid', 'type', 'uid'] },
            { keyPath: ['oid', 'type',] },
            { keyPath: ['oid', '_id'] },
        ],
    },
    {
        name: 'retailers', primaryKey: '_onid',
        indexes: [
            { keyPath: 'oid' },
            { keyPath: ['oid', '_uatdt'] },
            { keyPath: ['oid', '_id'] },
        ],
    },
    {
        name: 'products', primaryKey: '_onid',
        indexes: [
            { keyPath: 'oid' },
            { keyPath: ['oid', '_uatdt'] },
            { keyPath: ['oid', '_id'] },
        ],
    },
    {
        name: 'orders', primaryKey: '_onid',
        indexes: [
            { keyPath: 'oid' },
            { keyPath: ['oid', '_uatdt'] },
            { keyPath: ['oid', '_id'] },
        ],
    },
    {
        name: 'routes', primaryKey: '_onid',
        indexes: [
            { keyPath: 'oid' },
            { keyPath: ['oid', '_uatdt'] },
            { keyPath: ['oid', '_id'] },
        ],
    },
    {
        name: 'teams', primaryKey: '_onid',
        indexes: [
            { keyPath: 'oid' },
            { keyPath: ['oid', '_uatdt'] },
            { keyPath: ['oid', '_id'] },
        ],
    },
];




