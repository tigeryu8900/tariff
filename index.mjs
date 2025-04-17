import fs from "node:fs";
import module from "node:module";
import path from "node:path";
import process from "node:process";

/**
 * @typedef {
 *   | Int8Array
 *   | Uint8Array
 *   | Uint8ClampedArray
 *   | Int16Array
 *   | Uint16Array
 *   | Int32Array
 *   | Uint32Array
 *   | Float32Array
 *   | Float64Array
 *   | BigInt64Array
 *   | BigUint64Array
 * } TypedArray
 */

/**
 * @typedef {object} ResolveContext
 * @property {string[]} conditions
 * @property {object} importAttributes
 * @property {string | undefined} parentURL
 */

/**
 * @typedef {object} ResolveResult
 * @property {string | null | undefined} format
 * @property {object | undefined} importAttributes
 * @property {undefined | boolean} shortCircuit
 * @property {string} url
 * @property {boolean | undefined} tariffed
 */

/**
 * @typedef {object} LoadContext
 * @property {string[]} conditions
 * @property {string | null | undefined} format
 * @property {object} importAttributes
 */

/**
 * @typedef {object} LoadResult
 * @property {string} format
 * @property {undefined | boolean} shortCircuit
 * @property {string | ArrayBuffer | TypedArray} source
 * @property {boolean | undefined} tariffed
 */

/**
 * @returns {Record<string, number>}
 */
function getTariffs() {
    try {
        return JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "tariffs.json")));
    } catch (error) {
        return {};
    }
}

/** @type {Record<string, number>} */
const tariffs = getTariffs();

/** @type {Record<string, string>} */
const urlToSpecifier = {};

/** @type {Record<string, number>} */
const specifierToStartTime = {};

const trumpPhrases = [
    "American packages are WINNING AGAIN!",
    "We're bringing back JOBS to our codebase!",
    "This is how we get FAIR TRADE in Node.js!",
    "Big win for AMERICAN programmers!",
    "No more BAD DEALS with foreign packages!",
    "Making Programming Great Again!",
    "Believe me, this is the BEST tariff!",
    "We're going to win SO MUCH, you'll get tired of winning!",
    "This is how we Keep America Coding Again!",
    "HUGE success!"
];

function getTrumpPhrase() {
    return trumpPhrases[Math.floor(Math.random() * trumpPhrases.length)];
}

/**
 * @param {string} specifier
 * @param {ResolveContext} context
 * @param {(specifier: string, context: ResolveContext) => ResolveResult | Promise<ResolveResult>} nextResolve
 * @returns {Promise<ResolveResult>}
 */
export async function resolve(specifier, context, nextResolve) {
    const startTime = performance.now();
    const result = await nextResolve(specifier, context);
    if (!result.tariffed) {
        result.tariffed = true;
        urlToSpecifier[result.url] = specifier;
        specifierToStartTime[specifier] = startTime;
    }
    return result;
}

/**
 * @param {string} url
 * @param {LoadContext} context
 * @param {(url: string, context?: LoadContext) => LoadResult | Promise<LoadResult>} nextLoad
 * @returns {Promise<LoadResult>}
 */
export async function load(url, context, nextLoad) {
    const result = await nextLoad(url, context);
    if (!result.tariffed) {
        result.tariffed = true;
        if (urlToSpecifier.hasOwnProperty(url) && tariffs.hasOwnProperty(urlToSpecifier[url])) {
            const specifier = urlToSpecifier[url];
            const tariff = tariffs[specifier];
            if (result.format === 'commonjs' || result.format === 'module') {
                let source = result.source;
                if (typeof source !== 'string') {
                    const decoder = new TextDecoder();
                    source = decoder.decode(source);
                }
                result.source = String.raw`
                    ${source}
                    {
                        const now = performance.now();
                        const originalTime = now - ${specifierToStartTime[specifier]};
                        const waitTime = originalTime * ${tariff} / 100;
                        const waitUntil = now + waitTime;
                        while (performance.now() < waitUntil) {}
                        console.log("JUST IMPOSED a ${
                            tariff
                        }% TARIFF on ${
                            JSON.stringify(specifier).slice(1, -1)
                        }! Original import took " + originalTime + " ms, now takes " + (
                            originalTime + waitTime
                        ) + " ms. ${
                            JSON.stringify(getTrumpPhrase()).slice(1, -1)
                        }");
                    }
                `;
            } else {
                const now = performance.now();
                const originalTime = now - specifierToStartTime[specifier];
                const waitTime = originalTime * tariff / 100;
                const waitUntil = now + waitTime;
                while (performance.now() < waitUntil) {
                }
                console.log(`JUST IMPOSED a ${
                    tariff
                }% TARIFF on ${
                    specifier
                }! Original import took ${
                    originalTime
                } ms, now takes ${
                    originalTime + waitTime
                } ms. ${
                    getTrumpPhrase()
                }`);
            }
        }
    }
    return result;
}

const oldRequire = module.prototype.require;

module.prototype.require = function (specifier) {
    if (tariffs.hasOwnProperty(specifier)) {
        const tariff = tariffs[specifier];
        const startTime = performance.now();
        const result = oldRequire(specifier);
        const now = performance.now();
        const originalTime = now - startTime;
        const waitTime = originalTime * tariff / 100;
        const waitUntil = now + waitTime;
        while (performance.now() < waitUntil) {
        }
        console.log(`JUST IMPOSED a ${
            tariff
        }% TARIFF on ${
            specifier
        }! Original import took ${
            originalTime
        } ms, now takes ${
            originalTime + waitTime
        } ms. ${
            getTrumpPhrase()
        }`);
        return result;
    } else {
        return oldRequire(specifier);
    }
}

if (module.register) {
    module.register(import.meta.url);
}
