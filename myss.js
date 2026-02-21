// This javascript function parses a given XML file containing a social security earings
// record, such as the example file social-security-statement.xml.  It returns an
// array of data structures, one for each earning year where each object has
// three fields: year, ss (fica) taxes paid, and medicare taxes paid.

"use strict"

const UNLIMITED = Number.MAX_SAFE_INTEGER

const payrollTaxes = {
	1937: { ssRate: 1.0, medicareRate: 0.0, ssWages: 3000, medicareWages: null, },
	1938: { ssRate: 1.0, medicareRate: 0.0, ssWages: 3000, medicareWages: null, },
	1939: { ssRate: 1.0, medicareRate: 0.0, ssWages: 3000, medicareWages: null, },
	1940: { ssRate: 1.0, medicareRate: 0.0, ssWages: 3000, medicareWages: null, },
	1941: { ssRate: 1.0, medicareRate: 0.0, ssWages: 3000, medicareWages: null, },
	1942: { ssRate: 1.0, medicareRate: 0.0, ssWages: 3000, medicareWages: null, },
	1943: { ssRate: 1.0, medicareRate: 0.0, ssWages: 3000, medicareWages: null, },
	1944: { ssRate: 1.0, medicareRate: 0.0, ssWages: 3000, medicareWages: null, },
	1945: { ssRate: 1.0, medicareRate: 0.0, ssWages: 3000, medicareWages: null, },
	1946: { ssRate: 1.0, medicareRate: 0.0, ssWages: 3000, medicareWages: null, },
	1947: { ssRate: 1.0, medicareRate: 0.0, ssWages: 3000, medicareWages: null, },
	1948: { ssRate: 1.0, medicareRate: 0.0, ssWages: 3000, medicareWages: null, },
	1949: { ssRate: 1.0, medicareRate: 0.0, ssWages: 3000, medicareWages: null, },
	1950: { ssRate: 1.5, medicareRate: 0.0, ssWages: 3000, medicareWages: null, },
	1951: { ssRate: 1.5, medicareRate: 0.0, ssWages: 3600, medicareWages: null, },
	1952: { ssRate: 1.5, medicareRate: 0.0, ssWages: 3600, medicareWages: null, },
	1953: { ssRate: 1.5, medicareRate: 0.0, ssWages: 3600, medicareWages: null, },
	1954: { ssRate: 2.0, medicareRate: 0.0, ssWages: 3600, medicareWages: null, },
	1955: { ssRate: 2.0, medicareRate: 0.0, ssWages: 4200, medicareWages: null, },
	1956: { ssRate: 2.0, medicareRate: 0.0, ssWages: 4200, medicareWages: null, },
	1957: { ssRate: 2.25, medicareRate: 0.0, ssWages: 4200, medicareWages: null, },
	1958: { ssRate: 2.25, medicareRate: 0.0, ssWages: 4200, medicareWages: null, },
	1959: { ssRate: 2.5, medicareRate: 0.0, ssWages: 4800, medicareWages: null, },
	1960: { ssRate: 3.0, medicareRate: 0.0, ssWages: 4800, medicareWages: null, },
	1961: { ssRate: 3.0, medicareRate: 0.0, ssWages: 4800, medicareWages: null, },
	1962: { ssRate: 3.125, medicareRate: 0.0, ssWages: 4800, medicareWages: null, },
	1963: { ssRate: 3.625, medicareRate: 0.0, ssWages: 4800, medicareWages: null, },
	1964: { ssRate: 3.625, medicareRate: 0.0, ssWages: 4800, medicareWages: null, },
	1965: { ssRate: 3.625, medicareRate: 0.0, ssWages: 4800, medicareWages: null, },
	1966: { ssRate: 3.85, medicareRate: 0.35, ssWages: 6600, medicareWages: 6600, },
	1967: { ssRate: 3.9, medicareRate: 0.5, ssWages: 6600, medicareWages: 6600, },
	1968: { ssRate: 3.8, medicareRate: 0.6, ssWages: 7800, medicareWages: 7800, },
	1969: { ssRate: 4.2, medicareRate: 0.6, ssWages: 7800, medicareWages: 7800, },
	1970: { ssRate: 4.2, medicareRate: 0.6, ssWages: 7800, medicareWages: 7800, },
	1971: { ssRate: 4.6, medicareRate: 0.6, ssWages: 7800, medicareWages: 7800, },
	1972: { ssRate: 4.6, medicareRate: 0.6, ssWages: 9000, medicareWages: 9000, },
	1973: { ssRate: 4.85, medicareRate: 1.0, ssWages: 10800, medicareWages: 10800, },
	1974: { ssRate: 4.95, medicareRate: 0.9, ssWages: 13200, medicareWages: 13200, },
	1975: { ssRate: 4.95, medicareRate: 0.9, ssWages: 14100, medicareWages: 14100, },
	1976: { ssRate: 4.95, medicareRate: 0.9, ssWages: 15300, medicareWages: 15300, },
	1977: { ssRate: 4.95, medicareRate: 0.9, ssWages: 16500, medicareWages: 16500, },
	1978: { ssRate: 5.05, medicareRate: 1.0, ssWages: 17700, medicareWages: 17700, },
	1979: { ssRate: 5.08, medicareRate: 1.05, ssWages: 22900, medicareWages: 22900, },
	1980: { ssRate: 5.08, medicareRate: 1.05, ssWages: 25900, medicareWages: 25900, },
	1981: { ssRate: 5.35, medicareRate: 1.3, ssWages: 29700, medicareWages: 29700, },
	1982: { ssRate: 5.4, medicareRate: 1.3, ssWages: 32400, medicareWages: 32400, },
	1983: { ssRate: 5.4, medicareRate: 1.3, ssWages: 35700, medicareWages: 35700, },
	1984: { ssRate: 5.7, medicareRate: 1.3, ssWages: 37800, medicareWages: 37800, },
	1985: { ssRate: 5.7, medicareRate: 1.35, ssWages: 39600, medicareWages: 39600, },
	1986: { ssRate: 5.7, medicareRate: 1.45, ssWages: 42000, medicareWages: 42000, },
	1987: { ssRate: 5.7, medicareRate: 1.45, ssWages: 43800, medicareWages: 43800, },
	1988: { ssRate: 6.06, medicareRate: 1.45, ssWages: 45000, medicareWages: 45000, },
	1989: { ssRate: 6.06, medicareRate: 1.45, ssWages: 48000, medicareWages: 48000, },
	1990: { ssRate: 6.2, medicareRate: 1.45, ssWages: 51300, medicareWages: 51300, },
	1991: { ssRate: 6.2, medicareRate: 1.45, ssWages: 53400, medicareWages: 125000, },
	1992: { ssRate: 6.2, medicareRate: 1.45, ssWages: 55500, medicareWages: 130200, },
	1993: { ssRate: 6.2, medicareRate: 1.45, ssWages: 57600, medicareWages: 135000, },
	1994: { ssRate: 6.2, medicareRate: 1.45, ssWages: 60600, medicareWages: UNLIMITED, },
	1995: { ssRate: 6.2, medicareRate: 1.45, ssWages: 61200, medicareWages: UNLIMITED, },
	1996: { ssRate: 6.2, medicareRate: 1.45, ssWages: 62700, medicareWages: UNLIMITED, },
	1997: { ssRate: 6.2, medicareRate: 1.45, ssWages: 65400, medicareWages: UNLIMITED, },
	1998: { ssRate: 6.2, medicareRate: 1.45, ssWages: 68400, medicareWages: UNLIMITED, },
	1999: { ssRate: 6.2, medicareRate: 1.45, ssWages: 72600, medicareWages: UNLIMITED, },
	2000: { ssRate: 6.2, medicareRate: 1.45, ssWages: 76200, medicareWages: UNLIMITED, },
	2001: { ssRate: 6.2, medicareRate: 1.45, ssWages: 80400, medicareWages: UNLIMITED, },
	2002: { ssRate: 6.2, medicareRate: 1.45, ssWages: 84900, medicareWages: UNLIMITED, },
	2003: { ssRate: 6.2, medicareRate: 1.45, ssWages: 87000, medicareWages: UNLIMITED, },
	2004: { ssRate: 6.2, medicareRate: 1.45, ssWages: 87900, medicareWages: UNLIMITED, },
	2005: { ssRate: 6.2, medicareRate: 1.45, ssWages: 90000, medicareWages: UNLIMITED, },
	2006: { ssRate: 6.2, medicareRate: 1.45, ssWages: 94200, medicareWages: UNLIMITED, },
	2007: { ssRate: 6.2, medicareRate: 1.45, ssWages: 97500, medicareWages: UNLIMITED, },
	2008: { ssRate: 6.2, medicareRate: 1.45, ssWages: 102000, medicareWages: UNLIMITED, },
	2009: { ssRate: 6.2, medicareRate: 1.45, ssWages: 106800, medicareWages: UNLIMITED, },
	2010: { ssRate: 6.2, medicareRate: 1.45, ssWages: 106800, medicareWages: UNLIMITED, },
	2011: { ssRate: 4.2, medicareRate: 1.45, ssWages: 106800, medicareWages: UNLIMITED, },
	2012: { ssRate: 4.2, medicareRate: 1.45, ssWages: 110100, medicareWages: UNLIMITED, },
	2013: { ssRate: 6.2, medicareRate: 1.45, ssWages: 113700, medicareWages: UNLIMITED, obmacareThresholdSingle: 200000, obamacareThresholdJoint: 250000, obamacareRate: 0.9, },
	2014: { ssRate: 6.2, medicareRate: 1.45, ssWages: 117000, medicareWages: UNLIMITED, obmacareThresholdSingle: 200000, obamacareThresholdJoint: 250000, obamacareRate: 0.9, },
	2015: { ssRate: 6.2, medicareRate: 1.45, ssWages: 118500, medicareWages: UNLIMITED, obmacareThresholdSingle: 200000, obamacareThresholdJoint: 250000, obamacareRate: 0.9, },
	2016: { ssRate: 6.2, medicareRate: 1.45, ssWages: 118500, medicareWages: UNLIMITED, obmacareThresholdSingle: 200000, obamacareThresholdJoint: 250000, obamacareRate: 0.9, },
	2017: { ssRate: 6.2, medicareRate: 1.45, ssWages: 127200, medicareWages: UNLIMITED, obmacareThresholdSingle: 200000, obamacareThresholdJoint: 250000, obamacareRate: 0.9, },
	2018: { ssRate: 6.2, medicareRate: 1.45, ssWages: 128400, medicareWages: UNLIMITED, obmacareThresholdSingle: 200000, obamacareThresholdJoint: 250000, obamacareRate: 0.9, },
	2019: { ssRate: 6.2, medicareRate: 1.45, ssWages: 132900, medicareWages: UNLIMITED, obmacareThresholdSingle: 200000, obamacareThresholdJoint: 250000, obamacareRate: 0.9, },
	2020: { ssRate: 6.2, medicareRate: 1.45, ssWages: 137700, medicareWages: UNLIMITED, obmacareThresholdSingle: 200000, obamacareThresholdJoint: 250000, obamacareRate: 0.9, },
	2021: { ssRate: 6.2, medicareRate: 1.45, ssWages: 142800, medicareWages: UNLIMITED, obmacareThresholdSingle: 200000, obamacareThresholdJoint: 250000, obamacareRate: 0.9, },
	2022: { ssRate: 6.2, medicareRate: 1.45, ssWages: 147000, medicareWages: UNLIMITED, obmacareThresholdSingle: 200000, obamacareThresholdJoint: 250000, obamacareRate: 0.9, },
	2023: { ssRate: 6.2, medicareRate: 1.45, ssWages: 160200, medicareWages: UNLIMITED, obmacareThresholdSingle: 200000, obamacareThresholdJoint: 250000, obamacareRate: 0.9, },
	2024: { ssRate: 6.2, medicareRate: 1.45, ssWages: 168600, medicareWages: UNLIMITED, obmacareThresholdSingle: 200000, obamacareThresholdJoint: 250000, obamacareRate: 0.9, },
	2025: { ssRate: 6.2, medicareRate: 1.45, ssWages: 176100, medicareWages: UNLIMITED, obmacareThresholdSingle: 200000, obamacareThresholdJoint: 250000, obamacareRate: 0.9, },
	2026: { ssRate: 6.2, medicareRate: 1.45, ssWages: 184500, medicareWages: UNLIMITED, obmacareThresholdSingle: 200000, obamacareThresholdJoint: 250000, obamacareRate: 0.9, },
}


const sp500Returns = {
	2025: { return: 17.88 },
	2024: { return: 25.02 },
	2023: { return: 26.29 },
	2022: { return: -18.11 },
	2021: { return: 28.71 },
	2020: { return: 18.4 },
	2019: { return: 31.49 },
	2018: { return: -4.38 },
	2017: { return: 21.83 },
	2016: { return: 11.96 },
	2015: { return: 1.38 },
	2014: { return: 13.69 },
	2013: { return: 32.39 },
	2012: { return: 16.0 },
	2011: { return: 2.11 },
	2010: { return: 15.06 },
	2009: { return: 26.46 },
	2008: { return: -37.0 },
	2007: { return: 5.49 },
	2006: { return: 15.79 },
	2005: { return: 4.91 },
	2004: { return: 10.88 },
	2003: { return: 28.68 },
	2002: { return: -22.1 },
	2001: { return: -11.89 },
	2000: { return: -9.1 },
	1999: { return: 21.04 },
	1998: { return: 28.58 },
	1997: { return: 33.36 },
	1996: { return: 22.96 },
	1995: { return: 37.58 },
	1994: { return: 1.32 },
	1993: { return: 10.08 },
	1992: { return: 7.62 },
	1991: { return: 30.47 },
	1990: { return: -3.1 },
	1989: { return: 31.69 },
	1988: { return: 16.61 },
	1987: { return: 5.25 },
	1986: { return: 18.67 },
	1985: { return: 31.73 },
	1984: { return: 6.27 },
	1983: { return: 22.56 },
	1982: { return: 21.55 },
	1981: { return: -4.91 },
	1980: { return: 32.42 },
	1979: { return: 18.44 },
	1978: { return: 6.56 },
	1977: { return: -7.18 },
	1976: { return: 23.84 },
	1975: { return: 37.2 },
	1974: { return: -26.47 },
	1973: { return: -14.66 },
	1972: { return: 18.98 },
	1971: { return: 14.31 },
	1970: { return: 4.01 },
	1969: { return: -8.5 },
	1968: { return: 11.06 },
	1967: { return: 23.98 },
	1966: { return: -10.06 },
	1965: { return: 12.45 },
	1964: { return: 16.48 },
	1963: { return: 22.8 },
	1962: { return: -8.73 },
	1961: { return: 26.89 },
	1960: { return: 0.47 },
	1959: { return: 11.96 },
	1958: { return: 43.36 },
	1957: { return: -10.78 },
	1956: { return: 6.56 },
	1955: { return: 31.56 },
	1954: { return: 52.62 },
	1953: { return: -0.99 },
	1952: { return: 18.37 },
	1951: { return: 24.02 },
	1950: { return: 31.71 },
	1949: { return: 18.79 },
	1948: { return: 5.5 },
	1947: { return: 5.71 },
	1946: { return: -8.07 },
	1945: { return: 36.44 },
	1944: { return: 19.75 },
	1943: { return: 25.9 },
	1942: { return: 20.34 },
	1941: { return: -11.59 },
	1940: { return: -9.78 },
	1939: { return: -0.41 },
	1938: { return: 31.12 },
	1937: { return: -35.03 },
	1936: { return: 33.92 },
	1935: { return: 47.67 },
	1934: { return: -1.44 },
	1933: { return: 53.99 },
	1932: { return: -8.19 },
	1931: { return: -43.34 },
	1930: { return: -24.9 },
	1929: { return: -8.42 },
	1928: { return: 43.61 },
	1927: { return: 37.49 },
	1926: { return: 11.62 },
}

function parseSocialSecurityEarnings(xmlText) {
	if (typeof xmlText !== "string") {
		throw new TypeError("Expected XML text to be a string.")
	}

	const results = []
	const earningsBlocks = xmlText.matchAll(/<osss:Earnings\b[^>]*>[\s\S]*?<\/osss:Earnings>/g)

	for (const match of earningsBlocks) {
		const block = match[0]
		const startYearMatch = block.match(/startYear="(\d{4})"/)
		const endYearMatch = block.match(/endYear="(\d{4})"/)
		const ficaMatch = block.match(/<osss:FicaEarnings>\s*([^<]+)\s*<\/osss:FicaEarnings>/)
		const medicareMatch = block.match(/<osss:MedicareEarnings>\s*([^<]+)\s*<\/osss:MedicareEarnings>/)

		if (!startYearMatch || !endYearMatch || !ficaMatch || !medicareMatch) {
			continue
		}

		const startYear = Number.parseInt(startYearMatch[1], 10)
		const endYear = Number.parseInt(endYearMatch[1], 10)
		const fica = Number.parseFloat(ficaMatch[1])
		const medicare = Number.parseFloat(medicareMatch[1])

		if (!Number.isFinite(startYear) || !Number.isFinite(endYear)) {
			continue
		}

		for (let year = startYear; year <= endYear; year += 1) {
			results.push({ year, ssEarnings: fica, medicareEarnings: medicare })
		}
	}

	results.sort((a, b) => a.year - b.year)
	return results
}

/**
 * Takes as input an array of earnings objects as returned by parseSocialSecurityEarnings.
 * For each element in the array, adds nested objects for ss, medicare, obamacare, and total
 * with taxPaid, taxPaidCumulative, sp500return, and sp500returnCumulative fields.
 * 
 * This takes a second parameter, status, which can be 'single' or 'joint'; it defaults
 * to 'single'. The optional third parameter sets the savings rate percentage.
 * 
 * Medicare includes the additional Obamacare tax, while obamacare tracks only that portion.
 * Each subcategory's S&P 500 return and cumulative balance is based on that subcategory's
 * taxPaid contribution for the year.
 */
function addPaidTaxes(earnings, status = "single", savingsRate = 3, futureReturnPct = null) {
	earnings.sort((a, b) => a.year - b.year)
	const expandedEarnings = []
	let lastYear = null
	for (const record of earnings) {
		if (lastYear != null) {
			for (let year = lastYear + 1; year < record.year; year += 1) {
				expandedEarnings.push({ year, ssEarnings: 0, medicareEarnings: 0 })
			}
		}
		expandedEarnings.push(record)
		lastYear = record.year
	}
	const savingsRatePct = Number.isFinite(savingsRate) ? savingsRate : 3
	const applyReturns = (paid, sp500Cumulative, savingsCumulative, annualReturnPct, savingsRatePct) => {
		const sp500Return = Math.round((sp500Cumulative + paid) * (annualReturnPct / 100))
		const savingsReturn = Math.round((savingsCumulative + paid) * (savingsRatePct / 100))
		return {
			sp500Return,
			savingsReturn,
			sp500Cumulative: sp500Cumulative + paid + sp500Return,
			savingsCumulative: savingsCumulative + paid + savingsReturn,
		}
	}
	const buildAccount = (accountReturn, balance) => ({ return: accountReturn, balance })
	const buildEmptyAccount = (balance) => ({ return: null, balance })
	const buildMattressAccount = (balance) => ({ return: 0, balance })
	let ssPaidCumulative = 0
	let medicarePaidCumulative = 0
	let obamacarePaidCumulative = 0
	let totalPaidCumulative = 0
	let ssSp500Cumulative = 0
	let medicareSp500Cumulative = 0
	let obamacareSp500Cumulative = 0
	let totalSp500Cumulative = 0
	let ssSavingsCumulative = 0
	let medicareSavingsCumulative = 0
	let obamacareSavingsCumulative = 0
	let totalSavingsCumulative = 0
	let ssMattressCumulative = 0
	let medicareMattressCumulative = 0
	let obamacareMattressCumulative = 0
	let totalMattressCumulative = 0
	const filingStatus = status === "joint" ? "joint" : "single"

	for (const record of expandedEarnings) {
		const rate = payrollTaxes[record.year]
		const sp500AnnualReturn = sp500Returns[record.year]?.return
			?? (Number.isFinite(futureReturnPct) ? futureReturnPct : 0)
		const ssEarnings = record.ssEarnings
		const medicareEarnings = record.medicareEarnings
		if (!rate) {
			const ssReturns = applyReturns(
				0,
				ssSp500Cumulative,
				ssSavingsCumulative,
				sp500AnnualReturn,
				savingsRatePct
			)
			const medicareReturns = applyReturns(
				0,
				medicareSp500Cumulative,
				medicareSavingsCumulative,
				sp500AnnualReturn,
				savingsRatePct
			)
			const obamacareReturns = applyReturns(
				0,
				obamacareSp500Cumulative,
				obamacareSavingsCumulative,
				sp500AnnualReturn,
				savingsRatePct
			)
			const totalReturns = applyReturns(
				0,
				totalSp500Cumulative,
				totalSavingsCumulative,
				sp500AnnualReturn,
				savingsRatePct
			)

			ssSp500Cumulative = ssReturns.sp500Cumulative
			medicareSp500Cumulative = medicareReturns.sp500Cumulative
			obamacareSp500Cumulative = obamacareReturns.sp500Cumulative
			totalSp500Cumulative = totalReturns.sp500Cumulative
			ssSavingsCumulative = ssReturns.savingsCumulative
			medicareSavingsCumulative = medicareReturns.savingsCumulative
			obamacareSavingsCumulative = obamacareReturns.savingsCumulative
			totalSavingsCumulative = totalReturns.savingsCumulative

			record.sp500AnnualReturn = sp500AnnualReturn
			record.savingsInterest = savingsRate
			record.ss = {
				earnings: ssEarnings,
				taxRate: null,
				taxPaid: null,
				taxPaidCumulative: ssPaidCumulative,
				investmentAccount: buildAccount(ssReturns.sp500Return, ssSp500Cumulative),
				savingsAccount: buildAccount(ssReturns.savingsReturn, ssSavingsCumulative),
				mattressAccount: buildMattressAccount(ssMattressCumulative),
			}
			record.obamacareSurtax = {
				medicareEarnings,
				surtaxThreshold: null,
				surtaxEarnings: null,
				taxRate: null,
				taxPaid: null,
				taxPaidCumulative: obamacarePaidCumulative,
				investmentAccount: buildAccount(obamacareReturns.sp500Return, obamacareSp500Cumulative),
				savingsAccount: buildAccount(obamacareReturns.savingsReturn, obamacareSavingsCumulative),
				mattressAccount: buildMattressAccount(obamacareMattressCumulative),
			}
			record.medicare = {
				earnings: medicareEarnings,
				taxRate: null,
				obamacareSurtax: null,
				taxPaid: null,
				taxPaidCumulative: medicarePaidCumulative,
				investmentAccount: buildAccount(medicareReturns.sp500Return, medicareSp500Cumulative),
				savingsAccount: buildAccount(medicareReturns.savingsReturn, medicareSavingsCumulative),
				mattressAccount: buildMattressAccount(medicareMattressCumulative),
			}
			record.total = {
				earnings: medicareEarnings,
				taxPaid: null,
				taxPaidCumulative: totalPaidCumulative,
				investmentAccount: buildAccount(totalReturns.sp500Return, totalSp500Cumulative),
				savingsAccount: buildAccount(totalReturns.savingsReturn, totalSavingsCumulative),
				mattressAccount: buildMattressAccount(totalMattressCumulative),
			}
			continue
		}

		const ssCap = rate.ssWages ?? 0
		const medCap = rate.medicareWages ?? 0
		const ssTaxable = Math.min(ssEarnings, ssCap)
		const medTaxable = Math.min(medicareEarnings, medCap)
		const ssPaid = Math.round((ssTaxable * rate.ssRate) / 100)
		const medicarePaid = Math.round((medTaxable * rate.medicareRate) / 100)
		const obamacareRate = rate.obamacareRate ?? null
		let obamacarePaid = 0
		let surtaxThreshold = null
		let surtaxEarnings = 0
		let obamacareTaxRate = null
		if (obamacareRate != null) {
			surtaxThreshold =
				filingStatus === "joint"
					? rate.obamacareThresholdJoint
					: rate.obmacareThresholdSingle
			obamacareTaxRate = obamacareRate
			surtaxEarnings = Math.max(0, medicareEarnings - surtaxThreshold)
			if (surtaxEarnings > 0) {
				obamacarePaid = Math.round((surtaxEarnings * obamacareTaxRate) / 100)
			}
		}
		const medicareCombinedPaid = medicarePaid + obamacarePaid
		const totalPaid = ssPaid + medicareCombinedPaid

		ssPaidCumulative += ssPaid
		medicarePaidCumulative += medicareCombinedPaid
		obamacarePaidCumulative += obamacarePaid
		totalPaidCumulative += totalPaid

		const ssReturns = applyReturns(
			ssPaid,
			ssSp500Cumulative,
			ssSavingsCumulative,
			sp500AnnualReturn,
			savingsRatePct
		)
		const medicareReturns = applyReturns(
			medicareCombinedPaid,
			medicareSp500Cumulative,
			medicareSavingsCumulative,
			sp500AnnualReturn,
			savingsRatePct
		)
		const obamacareReturns = applyReturns(
			obamacarePaid,
			obamacareSp500Cumulative,
			obamacareSavingsCumulative,
			sp500AnnualReturn,
			savingsRatePct
		)
		const totalReturns = applyReturns(
			totalPaid,
			totalSp500Cumulative,
			totalSavingsCumulative,
			sp500AnnualReturn,
			savingsRatePct
		)

		ssSp500Cumulative = ssReturns.sp500Cumulative
		medicareSp500Cumulative = medicareReturns.sp500Cumulative
		obamacareSp500Cumulative = obamacareReturns.sp500Cumulative
		totalSp500Cumulative = totalReturns.sp500Cumulative
		ssSavingsCumulative = ssReturns.savingsCumulative
		medicareSavingsCumulative = medicareReturns.savingsCumulative
		obamacareSavingsCumulative = obamacareReturns.savingsCumulative
		totalSavingsCumulative = totalReturns.savingsCumulative
		ssMattressCumulative += ssPaid
		medicareMattressCumulative += medicareCombinedPaid
		obamacareMattressCumulative += obamacarePaid
		totalMattressCumulative += totalPaid

		record.sp500AnnualReturn = sp500AnnualReturn
		record.savingsInterest = savingsRatePct
		record.ss = {
			earnings: ssEarnings,
			taxRate: rate.ssRate,
			taxPaid: ssPaid,
			taxPaidCumulative: ssPaidCumulative,
			investmentAccount: buildAccount(ssReturns.sp500Return, ssSp500Cumulative),
			savingsAccount: buildAccount(ssReturns.savingsReturn, ssSavingsCumulative),
			mattressAccount: buildMattressAccount(ssMattressCumulative),
		}
		record.obamacareSurtax = {
			medicareEarnings,
			surtaxThreshold,
			surtaxEarnings,
			taxRate: obamacareTaxRate,
			taxPaid: obamacarePaid,
			taxPaidCumulative: obamacarePaidCumulative,
			investmentAccount: buildAccount(obamacareReturns.sp500Return, obamacareSp500Cumulative),
			savingsAccount: buildAccount(obamacareReturns.savingsReturn, obamacareSavingsCumulative),
			mattressAccount: buildMattressAccount(obamacareMattressCumulative),
		}
		record.medicare = {
			earnings: medicareEarnings,
			taxRate: rate.medicareRate,
			obamacareSurtax: obamacarePaid,
			taxPaid: medicareCombinedPaid,
			taxPaidCumulative: medicarePaidCumulative,
			investmentAccount: buildAccount(medicareReturns.sp500Return, medicareSp500Cumulative),
			savingsAccount: buildAccount(medicareReturns.savingsReturn, medicareSavingsCumulative),
			mattressAccount: buildMattressAccount(medicareMattressCumulative),
		}
		record.total = {
			taxPaid: totalPaid,
			taxPaidCumulative: totalPaidCumulative,
			investmentAccount: buildAccount(totalReturns.sp500Return, totalSp500Cumulative),
			savingsAccount: buildAccount(totalReturns.savingsReturn, totalSavingsCumulative),
			mattressAccount: buildMattressAccount(totalMattressCumulative),
		}
	}

	return expandedEarnings
}

function getTaxableEarningsFromGross(year, grossIncome) {
	if (!Number.isFinite(year) || !Number.isFinite(grossIncome)) {
		return { ssEarnings: null, medicareEarnings: null }
	}
	const rate = payrollTaxes[year]
	if (!rate) {
		return { ssEarnings: grossIncome, medicareEarnings: grossIncome }
	}
	const ssCap = rate.ssWages
	const medicareCap = rate.medicareWages
	const ssEarnings = ssCap == null ? grossIncome : Math.min(grossIncome, ssCap)
	const medicareEarnings = medicareCap == null ? grossIncome : Math.min(grossIncome, medicareCap)
	return { ssEarnings, medicareEarnings }
}

function calculatePayrollTaxes(year, ssEarnings, medicareEarnings, status = "single") {
	if (!Number.isFinite(year) || !Number.isFinite(ssEarnings) || !Number.isFinite(medicareEarnings)) {
		return { ssTax: null, medicareTax: null }
	}
	const rate = payrollTaxes[year]
	if (!rate) {
		return { ssTax: null, medicareTax: null }
	}
	const ssCap = rate.ssWages
	const medicareCap = rate.medicareWages
	const ssTaxable = ssCap == null ? ssEarnings : Math.min(ssEarnings, ssCap)
	const medicareTaxable = medicareCap == null ? medicareEarnings : Math.min(medicareEarnings, medicareCap)
	const ssTax = Math.round((ssTaxable * rate.ssRate) / 100)
	let medicareTax = Math.round((medicareTaxable * rate.medicareRate) / 100)
	const obamacareRate = rate.obamacareRate
	if (obamacareRate != null) {
		const threshold = status === "joint" ? rate.obamacareThresholdJoint : rate.obmacareThresholdSingle
		if (threshold != null) {
			const surtaxEarnings = Math.max(0, medicareEarnings - threshold)
			if (surtaxEarnings > 0) {
				medicareTax += Math.round((surtaxEarnings * obamacareRate) / 100)
			}
		}
	}
	return { ssTax, medicareTax }
}

function buildEstimatedEarnings({ startYear, endYear, currentIncome, raisePct }) {
	const normalizedStartYear = Number.parseInt(startYear, 10)
	const normalizedEndYear = Number.isFinite(endYear)
		? Number.parseInt(endYear, 10)
		: new Date().getFullYear()
	const currentYear = new Date().getFullYear()
	const normalizedIncome = Number(currentIncome)
	if (!Number.isFinite(normalizedStartYear) || !Number.isFinite(normalizedIncome)) {
		return null
	}
	if (normalizedStartYear > normalizedEndYear) {
		return []
	}
	const normalizedRaise = Number.isFinite(raisePct) ? raisePct : 0
	const raiseFactor = 1 + normalizedRaise / 100
	const anchorYear = normalizedEndYear <= currentYear ? normalizedEndYear : currentYear
	const anchorOffset = anchorYear - normalizedStartYear
	const startingIncome = raiseFactor === 0
		? normalizedIncome
		: normalizedIncome / Math.pow(raiseFactor, anchorOffset)
	const earnings = []
	for (let year = normalizedStartYear; year <= normalizedEndYear; year += 1) {
		const yearIndex = year - normalizedStartYear
		const grossIncome = year === anchorYear
			? Math.round(normalizedIncome)
			: Math.round(startingIncome * Math.pow(raiseFactor, yearIndex))
		const taxable = getTaxableEarningsFromGross(year, grossIncome)
		earnings.push({
			year,
			grossIncome,
			ssEarnings: taxable.ssEarnings ?? 0,
			medicareEarnings: taxable.medicareEarnings ?? 0,
		})
	}
	return earnings
}

function estimateAnnualBenefitFromEarnings(earnings, years = 5, replacementRate = 0.4) {
	if (!Array.isArray(earnings) || !earnings.length) {
		return 0
	}
	const sorted = earnings.slice().sort((a, b) => a.year - b.year)
	const recent = sorted.slice(-Math.max(1, years))
	const total = recent.reduce((sum, record) => sum + (record.ssEarnings ?? 0), 0)
	const average = total / recent.length
	return Math.round(average * replacementRate)
}

function calculateNetPresentValue({
	currentYear,
	currentAge,
	claimAge,
	lifeExpectancy,
	endYear,
	discountRate,
	colaRate,
	earnings,
}) {
	const normalizedCurrentYear = Number.parseInt(currentYear, 10)
	const normalizedCurrentAge = Number.parseInt(currentAge, 10)
	const normalizedClaimAge = Number.parseInt(claimAge, 10)
	const normalizedLifeExpectancy = Number.parseInt(lifeExpectancy, 10)
	const normalizedDiscount = Number.isFinite(discountRate) ? discountRate : 0
	const normalizedCola = Number.isFinite(colaRate) ? colaRate : 0
	if (
		!Number.isFinite(normalizedCurrentYear)
		|| !Number.isFinite(normalizedCurrentAge)
		|| !Number.isFinite(normalizedClaimAge)
		|| !Number.isFinite(normalizedLifeExpectancy)
	) {
		return { npv: null, annualBenefit: null }
	}
	const annualBenefit = estimateAnnualBenefitFromEarnings(earnings)
	const claimOffsetYears = normalizedClaimAge - normalizedCurrentAge
	const yearsOfBenefits = Math.max(0, normalizedLifeExpectancy - normalizedClaimAge)
	if (annualBenefit <= 0 || yearsOfBenefits <= 0) {
		return { npv: 0, annualBenefit }
	}
	let npv = 0
	// Determine calendar year of first benefit payment
	const claimYear = normalizedCurrentYear + Math.max(0, claimOffsetYears)
	const colaTable = myss._ssa && myss._ssa.cola ? myss._ssa.cola : null
	for (let yearIndex = 0; yearIndex <= yearsOfBenefits; yearIndex += 1) {
		// benefit grows by applying COLA for each calendar year starting at claimYear
		let benefit = annualBenefit
		if (colaTable) {
			for (let k = 0; k < yearIndex; k += 1) {
				const y = claimYear + k
				const colaPct = Number.isFinite(Number(colaTable[y])) ? Number(colaTable[y]) : normalizedCola
				benefit *= (1 + colaPct / 100)
			}
		} else {
			benefit = annualBenefit * Math.pow(1 + normalizedCola / 100, yearIndex)
		}
		const yearsFromNow = Math.max(0, claimOffsetYears) + yearIndex
		const discountFactor = Math.pow(1 + normalizedDiscount / 100, yearsFromNow)
		npv += benefit / discountFactor
	}
	return { npv: Math.round(npv), annualBenefit }
}

function calculateNetPresentValueSeries({
	currentYear,
	currentAge,
	claimAge,
	lifeExpectancy,
	endYear,
	discountRate,
	colaRate,
	earnings,
}) {
	const normalizedCurrentYear = Number.parseInt(currentYear, 10)
	const normalizedCurrentAge = Number.parseInt(currentAge, 10)
	const normalizedClaimAge = Number.parseInt(claimAge, 10)
	const normalizedLifeExpectancy = Number.parseInt(lifeExpectancy, 10)
	const normalizedEndYear = Number.isFinite(endYear)
		? Number.parseInt(endYear, 10)
		: null
	const normalizedDiscount = Number.isFinite(discountRate) ? discountRate : 0
	const normalizedCola = Number.isFinite(colaRate) ? colaRate : 0
	if (
		!Number.isFinite(normalizedCurrentYear)
		|| !Number.isFinite(normalizedCurrentAge)
		|| !Number.isFinite(normalizedClaimAge)
		|| !Number.isFinite(normalizedLifeExpectancy)
	) {
		return []
	}
	const annualBenefit = estimateAnnualBenefitFromEarnings(earnings)
	const endYearEffective = normalizedEndYear == null ? normalizedCurrentYear : normalizedEndYear
	const startYear = Array.isArray(earnings) && earnings.length
		? Math.min(...earnings.map((record) => record.year))
		: normalizedCurrentYear
	const series = []
	for (let year = startYear; year <= endYearEffective; year += 1) {
		const ageAtYear = normalizedCurrentAge - (normalizedCurrentYear - year)
		if (annualBenefit <= 0 || ageAtYear < 0) {
			series.push({ year, npv: 0 })
			continue
		}
		const remainingYears = Math.max(0, normalizedLifeExpectancy - Math.max(ageAtYear, normalizedClaimAge))
		const yearsOfBenefits = remainingYears
		if (yearsOfBenefits <= 0) {
			series.push({ year, npv: 0 })
			continue
		}
		const benefitBaseIndex = Math.max(0, Math.max(ageAtYear, normalizedClaimAge) - normalizedClaimAge)
		let npv = 0
		// Determine calendar year of first benefit payment for this series year
		const claimYear = normalizedCurrentYear + Math.max(0, normalizedClaimAge - normalizedCurrentAge)
		const colaTable = myss._ssa && myss._ssa.cola ? myss._ssa.cola : null
		for (let yearIndex = 0; yearIndex <= yearsOfBenefits; yearIndex += 1) {
			const benefitIndex = benefitBaseIndex + yearIndex
			let benefit = annualBenefit
			if (colaTable) {
				for (let k = 0; k < benefitIndex; k += 1) {
					const y = claimYear + k
					const colaPct = Number.isFinite(Number(colaTable[y])) ? Number(colaTable[y]) : normalizedCola
					benefit *= (1 + colaPct / 100)
				}
			} else {
				benefit = annualBenefit * Math.pow(1 + normalizedCola / 100, benefitIndex)
			}
			const yearsFromNow = Math.max(0, normalizedClaimAge - ageAtYear) + yearIndex
			const discountFactor = Math.pow(1 + normalizedDiscount / 100, yearsFromNow)
			npv += benefit / discountFactor
		}
		series.push({ year, npv: Math.round(npv) })
	}
	return series
}

const myss = {
    parseSocialSecurityEarnings,
    addPaidTaxes,
    getTaxableEarningsFromGross,
    calculatePayrollTaxes,
    buildEstimatedEarnings,
    estimateAnnualBenefitFromEarnings,
    calculateNetPresentValue,
    calculateNetPresentValueSeries
}

function initUI() {
	const xmlUpload = document.getElementById("xmlUpload")
	const statusText = document.getElementById("statusText")
	const overviewNetPresentValue = document.getElementById("overviewNetPresentValue")
	const overviewAime = document.getElementById("overviewAime")
	const overviewPia = document.getElementById("overviewPia")
	const overviewMonthlyBenefit = document.getElementById("overviewMonthlyBenefit")
	const overviewStartingYear = document.getElementById("overviewStartingYear")
	const overviewAnnualBenefit = document.getElementById("overviewAnnualBenefit")
	const overviewSavingsBalance = document.getElementById("overviewSavingsBalance")
	const overviewInvestmentBalance = document.getElementById("overviewInvestmentBalance")
	const reportsPanel = document.getElementById("reportsPanel")
	const savingsRateInput = document.getElementById("savingsRate")
	const investmentChartCanvas = document.getElementById("investmentChart")
	const earningsTableBody = document.getElementById("earningsTableBody")
	const estimateCalculateButton = document.getElementById("estimateCalculate")
	const currentIncomeInput = document.getElementById("currentIncome")
	const firstYearWorkingSelect = document.getElementById("firstYearWorking")
	const lastYearWorkingSelect = document.getElementById("lastYearWorking")
	const annualRaisesInput = document.getElementById("annualRaises")
	const currentAgeSelect = document.getElementById("currentAge")
	const lifeExpectancySelect = document.getElementById("lifeExpectancy")
	const futureReturnsSelect = document.getElementById("futureReturns")
	const npvDiscountSelect = document.getElementById("npvDiscountRate")
	const benefitColaSelect = document.getElementById("benefitCola")
	const retireAgeSelect = document.getElementById("retireAge")
	const opportunityRangeSelect = document.getElementById("opportunityRange")
	const tabButtons = document.querySelectorAll(".tab-button[data-tab-group='inputs']")
	const tabPanels = document.querySelectorAll(".tab-panel[data-tab-group='inputs']")
	const earningsSourceSelect = document.getElementById("earningsSource")
	const entryPanels = document.querySelectorAll(".entry-panel")
	let investmentChart = null
	let tableIsDirty = false
	let lastXmlText = ""

	/*
	 * Embedded SSA reference tables (placeholders / reasonable estimates)
	 * Sources (authoritative):
	 *  - PIA bend points: https://www.ssa.gov/OACT/COLA/bendpoints.html
	 *  - COLA history:       https://www.ssa.gov/OACT/COLA/colalist.html
	 *  - Average Wage Index: https://www.ssa.gov/OACT/COLA/awidevelop.html
	 *
	 * NOTE: These values are estimates used as placeholders. 2026 entries are
	 * marked provisional where appropriate. Replace with official SSA values
	 * if you need full accuracy.
	 */

	const SSA_BEND_POINTS = (() => {
		const out = {}
		// Simple increasing placeholders from 1978..2026.
		// b1 starts near 200 in 1978 and grows ~3%/year; b2 starts near 1200 and grows similarly.
		for (let y = 1978; y <= 2026; y++) {
			const years = y - 1978
			const b1 = Math.round(200 * Math.pow(1.03, years))
			const b2 = Math.round(1200 * Math.pow(1.03, years))
			out[y] = [b1, b2]
		}
		// Overwrite recent known values (more accurate defaults)
		out[2023] = [1115, 6721]
		out[2024] = [1115, 6721]
		out[2025] = [1115, 6721]
		// 2026 provisional (use 2025 values as placeholder)
		out[2026] = [1115, 6721]
		return out
	})()

	const SSA_COLA = (() => {
		const out = {}
		// Placeholder COLA percent per year (in percent). Use modest rates, with
		// higher recent values where commonly known.
		for (let y = 1978; y <= 2026; y++) {
			// typical long-run average ~3%; vary a bit by decade
			let v = 3.0
			if (y >= 1978 && y < 1985) v = 6.0
			else if (y < 1995) v = 3.5
			else if (y < 2005) v = 2.5
			else if (y < 2015) v = 1.5
			else if (y < 2020) v = 1.8
			else if (y === 2021) v = 5.9
			else if (y === 2022) v = 8.7
			else if (y === 2023) v = 3.2
			else if (y === 2024) v = 3.5
			else v = 2.5
			out[y] = v
		}
		// mark 2026 provisional (placeholder)
		out[2026] = 2.5
		return out
	})()

	const SSA_AWI = (() => {
		const out = {}
		// Placeholder AWI: start around 6000 in 1978 and grow ~3.5%/year to 2026
		let val = 6000
		for (let y = 1978; y <= 2026; y++) {
			out[y] = Math.round(val)
			val *= 1.035
		}
		// For convenience, set a few recent real-ish values
		out[2020] = 55628.60
		out[2021] = 60575.07
		out[2022] = 63795.13
		out[2023] = 66621.80
		out[2024] = 69846.57
		out[2025] = Math.round(out[2024] * 1.03)
		out[2026] = Math.round(out[2025] * 1.03) // provisional
		return out
	})()

	// make available to rest of module
	myss._ssa = { bendPoints: SSA_BEND_POINTS, awi: SSA_AWI, cola: SSA_COLA }

	const populateAgeSelect = (select, defaultValue, minAge = 15, maxAge = 100) => {
		if (!select) {
			return
		}
		const selectedValue = Number(defaultValue)
		for (let age = Number(minAge); age <= Number(maxAge); age += 1) {
			const option = document.createElement("option")
			option.value = String(age)
			option.textContent = String(age)
			if (age === selectedValue) {
				option.selected = true
			}
			select.appendChild(option)
		}
	}

	const populateYearSelect = (select, startYear, endYear, defaultValue) => {
		if (!select) {
			return
		}
		const selectedValue = Number(defaultValue)
		for (let year = startYear; year <= endYear; year += 1) {
			const option = document.createElement("option")
			option.value = String(year)
			option.textContent = String(year)
			if (year === selectedValue) {
				option.selected = true
			}
			select.appendChild(option)
		}
	}

	const populatePercentSelect = (select, startValue, endValue, defaultValue, step = 1) => {
		if (!select) {
			return
		}
		const selectedValue = Number(defaultValue)
		for (let value = startValue; value <= endValue; value += step) {
			const displayValue = Number.isInteger(value) ? String(value) : value.toFixed(1)
			const option = document.createElement("option")
			option.value = displayValue
			option.textContent = displayValue
			if (value === selectedValue) {
				option.selected = true
			}
			select.appendChild(option)
		}
	}

		populateAgeSelect(document.getElementById("currentAge"), 40)
		populateAgeSelect(document.getElementById("retirementAge"), 65)
		// limit retireAge to typical SSA claim ages 62..70
		populateAgeSelect(document.getElementById("retireAge"), 65, 62, 70)
		populateAgeSelect(document.getElementById("lifeExpectancy"), 85)
	populatePercentSelect(document.getElementById("futureReturns"), 0, 15, 7)
	populatePercentSelect(document.getElementById("npvDiscountRate"), 0, 10, 3)
	populatePercentSelect(document.getElementById("benefitCola"), 0, 5, 2)
	populatePercentSelect(document.getElementById("savingsRate"), 0, 10, 3)
	populateYearSelect(document.getElementById("firstYearWorking"), 1950, 2099, 1996)
	populateYearSelect(document.getElementById("lastYearWorking"), 1950, 2099, 2026)

	const formatMoney = (value) => {
		if (value == null || Number.isNaN(value)) {
			return "--"
		}
		return value.toLocaleString("en-US", {
			style: "currency",
			currency: "USD",
			maximumFractionDigits: 0,
		})
	}

	const setStatus = (message, isError = false) => {
		if (!statusText) return
		statusText.textContent = message
		statusText.style.color = isError ? "#a42b2b" : "var(--muted)"
	}

	const setReportsVisibility = (hasEarnings) => {
		if (!reportsPanel) {
			return
		}
		reportsPanel.classList.toggle("is-hidden", !hasEarnings)
	}

	const parseEarningsFromXml = (xmlText, reportErrors) => {
		if (!xmlText) {
			return null
		}
		try {
			const parsed = parseSocialSecurityEarnings(xmlText)
			if (!parsed.length) {
				if (reportErrors) {
					setStatus("No earnings records were found in the XML.", true)
				}
				return null
			}
			return parsed
		} catch (error) {
			if (reportErrors) {
				setStatus("Failed to parse XML: " + error.message, true)
			}
			return null
		}
	}

	const parseDateOfBirthFromXml = (xmlText) => {
		if (!xmlText) {
			return null
		}
		const match = xmlText.match(/<osss:DateOfBirth>\s*([0-9]{4}-[0-9]{2}-[0-9]{2})\s*<\/osss:DateOfBirth>/)
		if (!match) {
			return null
		}
		const date = new Date(match[1])
		return Number.isNaN(date.getTime()) ? null : date
	}

	const getAgeFromDate = (birthDate, today = new Date()) => {
		let age = today.getFullYear() - birthDate.getFullYear()
		const monthDiff = today.getMonth() - birthDate.getMonth()
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
			age -= 1
		}
		return age
	}

	const activateTab = (tabName) => {
		tabButtons.forEach((button) => {
			const isActive = button.dataset.tab === tabName
			button.classList.toggle("is-active", isActive)
			button.setAttribute("aria-selected", isActive ? "true" : "false")
		})

		tabPanels.forEach((panel) => {
			const isActive = panel.id === `tab-${tabName}`
			panel.classList.toggle("is-active", isActive)
			panel.hidden = !isActive
		})
	}

	if (tabButtons.length > 1) {
		tabButtons.forEach((button) => {
			button.addEventListener("click", () => activateTab(button.dataset.tab))
		})
	}

	const activateEntryPanel = (panelName) => {
		entryPanels.forEach((panel) => {
			const isActive = panel.id === `entry-${panelName}`
			panel.hidden = !isActive
		})
	}

	earningsSourceSelect?.addEventListener("change", () => {
		activateEntryPanel(earningsSourceSelect.value)
	})

	activateEntryPanel(earningsSourceSelect?.value ?? "estimate")

	const renderInvestmentChart = (earnings, npvSeries) => {
		if (typeof Chart === "undefined") {
			setStatus("Chart.js failed to load. Please refresh and try again.", true)
			return
		}

		const labels = earnings.map((record) => String(record.year))
		const balances = earnings.map((record) => record.total.investmentAccount.balance)
		const savingsBalances = earnings.map((record) => record.total.savingsAccount.balance)
		const npvByYear = new Map(npvSeries.map((record) => [record.year, record.npv]))
		const npvValues = earnings.map((record) => npvByYear.get(record.year) ?? null)

		if (investmentChart) {
			investmentChart.destroy()
		}

		investmentChart = new Chart(investmentChartCanvas, {
			type: "line",
			data: {
				labels,
				datasets: [
					{
						label: "NPV",
						data: npvValues,
						borderColor: "#b45309",
						backgroundColor: "rgba(180, 83, 9, 0.12)",
						borderWidth: 2,
						pointRadius: 0,
						fill: false,
						tension: 0.25,
					},
					{
						label: "Savings",
						data: savingsBalances,
						borderColor: "#0f766e",
						backgroundColor: "rgba(15, 118, 110, 0.12)",
						borderWidth: 2,
						pointRadius: 0,
						fill: true,
						tension: 0.25,
					},
					{
						label: "Investment",
						data: balances,
						borderColor: "#1d4ed8",
						backgroundColor: "rgba(29, 78, 216, 0.15)",
						borderWidth: 2,
						pointRadius: 0,
						fill: true,
						tension: 0.25,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				interaction: {
					mode: "index",
					intersect: false,
				},
				plugins: {
					legend: {
						display: true,
						position: "bottom",
					},
					tooltip: {
						callbacks: {
							label: (context) => formatMoney(context.parsed.y),
						},
					},
				},
				scales: {
					x: {
						ticks: {
							maxRotation: 0,
							autoSkip: true,
							maxTicksLimit: 12,
						},
					},
					y: {
						ticks: {
							callback: (value) => formatMoney(value),
						},
					},
				},
			},
		})
	}

	const buildNpvSeries = (inputs) => calculateNetPresentValueSeries(inputs)

	const formatNumber = (value) => {
		if (value == null || Number.isNaN(value)) {
			return ""
		}
		return Number(value).toLocaleString("en-US", {
			maximumFractionDigits: 0,
		})
	}

	const renderEarningsTable = (earnings) => {
		if (!earningsTableBody) {
			return
		}
		earningsTableBody.textContent = ""
		earnings.forEach((record) => {
			const row = document.createElement("tr")
			const yearCell = document.createElement("td")
			const ssCell = document.createElement("td")
			const medicareCell = document.createElement("td")
			const grossCell = document.createElement("td")
			const ssTaxCell = document.createElement("td")
			const medicareTaxCell = document.createElement("td")

			const yearInput = document.createElement("input")
			yearInput.type = "text"
			yearInput.value = String(record.year)
			yearInput.className = "table-input"
			yearInput.dataset.field = "year"

			const ssInput = document.createElement("input")
			ssInput.type = "text"
			ssInput.value = formatNumber(record.ssEarnings)
			ssInput.className = "table-input"
			ssInput.dataset.field = "ssEarnings"


			const medicareInput = document.createElement("input")
			medicareInput.type = "text"
			medicareInput.value = formatNumber(record.medicareEarnings)
			medicareInput.className = "table-input"
			medicareInput.dataset.field = "medicareEarnings"


			const grossInput = document.createElement("input")
			grossInput.type = "text"
			grossInput.value = formatNumber(record.grossIncome)
			grossInput.className = "table-input"
			grossInput.dataset.field = "grossIncome"

			const ssTaxInput = document.createElement("input")
			ssTaxInput.type = "text"
			ssTaxInput.value = ""
			ssTaxInput.className = "table-input table-input--readonly"
			ssTaxInput.dataset.field = "ssTax"
			ssTaxInput.readOnly = true
			ssTaxInput.tabIndex = -1

			const medicareTaxInput = document.createElement("input")
			medicareTaxInput.type = "text"
			medicareTaxInput.value = ""
			medicareTaxInput.className = "table-input table-input--readonly"
			medicareTaxInput.dataset.field = "medicareTax"
			medicareTaxInput.readOnly = true
			medicareTaxInput.tabIndex = -1

			yearCell.appendChild(yearInput)
			ssCell.appendChild(ssInput)
			medicareCell.appendChild(medicareInput)
			grossCell.appendChild(grossInput)
			ssTaxCell.appendChild(ssTaxInput)
			medicareTaxCell.appendChild(medicareTaxInput)
			row.appendChild(yearCell)
			row.appendChild(ssCell)
			row.appendChild(medicareCell)
			row.appendChild(grossCell)
			row.appendChild(ssTaxCell)
			row.appendChild(medicareTaxCell)
			updateRowTaxes(row)
			earningsTableBody.appendChild(row)
		})
	}

	const parseNumberInput = (value) => {
		if (typeof value !== "string") {
			return NaN
		}
		const cleaned = value.replace(/[^0-9.-]/g, "")
		return Number.parseFloat(cleaned)
	}

	const updateRowTaxes = (row) => {
		const yearValue = row.querySelector("[data-field='year']")?.value ?? ""
		const ssValue = row.querySelector("[data-field='ssEarnings']")?.value ?? ""
		const medicareValue = row.querySelector("[data-field='medicareEarnings']")?.value ?? ""
		const year = Number.parseInt(yearValue, 10)
		const ssParsed = parseNumberInput(ssValue)
		const medicareParsed = parseNumberInput(medicareValue)
		const taxes = calculatePayrollTaxes(year, ssParsed, medicareParsed)
		const ssTaxInput = row.querySelector("[data-field='ssTax']")
		const medicareTaxInput = row.querySelector("[data-field='medicareTax']")
		if (ssTaxInput instanceof HTMLInputElement) {
			ssTaxInput.value = Number.isFinite(taxes.ssTax) ? formatNumber(taxes.ssTax) : ""
		}
		if (medicareTaxInput instanceof HTMLInputElement) {
			medicareTaxInput.value = Number.isFinite(taxes.medicareTax) ? formatNumber(taxes.medicareTax) : ""
		}
	}

	const readEarningsTable = () => {
		if (!earningsTableBody) {
			return []
		}
		const rows = Array.from(earningsTableBody.querySelectorAll("tr"))
		const byYear = new Map()
		rows
			.map((row) => {
				const yearValue = row.querySelector("[data-field='year']")?.value ?? ""
				const ssValue = row.querySelector("[data-field='ssEarnings']")?.value ?? ""
				const medicareValue = row.querySelector("[data-field='medicareEarnings']")?.value ?? ""
				const grossValue = row.querySelector("[data-field='grossIncome']")?.value ?? ""
				const year = Number.parseInt(yearValue, 10)
				const ssParsed = parseNumberInput(ssValue)
				const medicareParsed = parseNumberInput(medicareValue)
				const grossParsed = parseNumberInput(grossValue)
				if (!Number.isFinite(year)) {
					return null
				}
				const ssEarnings = Number.isFinite(ssParsed) ? ssParsed : 0
				const medicareEarnings = Number.isFinite(medicareParsed) ? medicareParsed : 0
				const grossIncome = Number.isFinite(grossParsed) ? grossParsed : 0
				return { year, ssEarnings, medicareEarnings, grossIncome }
			})
			.filter(Boolean)
			.forEach((record) => {
				const existing = byYear.get(record.year)
				if (existing) {
					existing.ssEarnings += record.ssEarnings
					existing.medicareEarnings += record.medicareEarnings
					existing.grossIncome += record.grossIncome
				} else {
					byYear.set(record.year, { ...record })
				}
			})
		return Array.from(byYear.values()).sort((a, b) => a.year - b.year)
	}

	const updateFromEarnings = (earnings) => {
		if (!earnings.length) {
			setReportsVisibility(false)
			return
		}
		setReportsVisibility(true)
		const currentAge = Number.parseInt(currentAgeSelect?.value ?? "", 10)
		const lifeExpectancy = Number.parseInt(lifeExpectancySelect?.value ?? "", 10)
		const futureReturn = Number.parseFloat(futureReturnsSelect?.value ?? "")
		const discountRate = Number.parseFloat(npvDiscountSelect?.value ?? "")
		const colaRate = Number.parseFloat(benefitColaSelect?.value ?? "")
		const claimAge = Number.parseInt(retireAgeSelect?.value ?? "", 10)
		const rangeMode = opportunityRangeSelect?.value ?? "to-date"
		const yearsRemaining = Number.isFinite(currentAge) && Number.isFinite(lifeExpectancy)
			? Math.max(0, lifeExpectancy - currentAge)
			: 0
		const currentYear = new Date().getFullYear()
		const projectedEndYear = currentYear + yearsRemaining
		const endYear = rangeMode === "lifetime" ? projectedEndYear : currentYear
		const baseEarnings = earnings
			.slice()
			.sort((a, b) => a.year - b.year)
			.filter((record) => record.year <= endYear)
		const lastYear = baseEarnings[baseEarnings.length - 1].year
		if (Number.isFinite(endYear) && endYear > lastYear) {
			for (let year = lastYear + 1; year <= endYear; year += 1) {
				baseEarnings.push({ year, ssEarnings: 0, medicareEarnings: 0, grossIncome: 0 })
			}
		}
		const savingsRate = Number.parseFloat(savingsRateInput.value)
		const normalizedSavingsRate = Number.isFinite(savingsRate) ? savingsRate : 3
		const normalizedFutureReturn = Number.isFinite(futureReturn) ? futureReturn : 0
		const expandedEarnings = addPaidTaxes(
			baseEarnings,
			"single",
			normalizedSavingsRate,
			normalizedFutureReturn
		)
		const currentYearRecord = expandedEarnings.find((record) => record.year === currentYear)
		const overviewTotal = currentYearRecord?.total
		if (overviewTotal) {
			overviewSavingsBalance.textContent = formatMoney(overviewTotal.savingsAccount.balance)
			overviewInvestmentBalance.textContent = formatMoney(overviewTotal.investmentAccount.balance)
		} else {
			overviewSavingsBalance.textContent = "--"
			overviewInvestmentBalance.textContent = "--"
		}
		const npvResult = calculateNetPresentValue({
			currentYear: new Date().getFullYear(),
			currentAge,
			claimAge,
			lifeExpectancy,
			endYear,
			discountRate,
			colaRate,
			earnings,
		})
		if (npvResult?.npv == null) {
			overviewNetPresentValue.textContent = "--"
		} else {
			overviewNetPresentValue.textContent = formatMoney(npvResult.npv)
		}
		// Compute AIME and PIA and display
		try {
			// determine whether to use wage-indexing: prefer DOB from lastXmlText, otherwise infer from current age
			let birthYearForIndex = null
			const dob = parseDateOfBirthFromXml(lastXmlText)
			if (dob) birthYearForIndex = dob.getFullYear()
			else if (Number.isFinite(currentAge)) {
				const inferred = new Date().getFullYear() - currentAge
				birthYearForIndex = inferred
			}
			const aimeResult = calculateAime(earnings, { useWageIndex: true, birthYear: birthYearForIndex })
			const aimeValue = Number.isFinite(aimeResult.aime) ? aimeResult.aime : null
			overviewAime.textContent = Number.isFinite(aimeValue) ? formatMoney(aimeValue) : "--"
			const piaResult = calculatePia(aimeValue || 0)
			overviewPia.textContent = piaResult && Number.isFinite(piaResult.pia) ? formatMoney(piaResult.pia) : "--"
			// Monthly benefit based on selected claim age
			try {
				const claimAge = Number.parseFloat(retireAgeSelect?.value ?? "")
				const mb = calculateMonthlyBenefit({ pia: piaResult.pia, retireAge: claimAge })
				overviewMonthlyBenefit.textContent = mb && Number.isFinite(mb.monthly) ? formatMoney(mb.monthly) : "--"
				// Starting year based on current year and claim age
				try {
					const startYear = Number.isFinite(currentYear) && Number.isFinite(currentAge) && Number.isFinite(claimAge)
						? currentYear + Math.max(0, (Number(claimAge) - Number(currentAge)))
						: null
					overviewStartingYear.textContent = Number.isFinite(startYear) ? String(startYear) : "--"
					// Annual benefit = monthly * 12
					const monthlyVal = mb && Number.isFinite(mb.monthly) ? mb.monthly : null
					overviewAnnualBenefit.textContent = monthlyVal ? formatMoney(Math.round(monthlyVal * 12)) : "--"
				} catch (e) {
					if (overviewStartingYear) overviewStartingYear.textContent = "--"
					if (overviewAnnualBenefit) overviewAnnualBenefit.textContent = "--"
				}
			} catch (err) {
				if (overviewMonthlyBenefit) overviewMonthlyBenefit.textContent = "--"
			}
		} catch (e) {
			if (overviewAime) overviewAime.textContent = "--"
			if (overviewPia) overviewPia.textContent = "--"
		}
		const npvSeries = buildNpvSeries({
			currentYear: new Date().getFullYear(),
			currentAge,
			claimAge,
			lifeExpectancy,
			endYear,
			discountRate,
			colaRate,
			earnings,
		})
		renderInvestmentChart(expandedEarnings, npvSeries)
	}

	const handleXmlText = (xmlText, reportErrors) => {
		const earnings = parseEarningsFromXml(xmlText, reportErrors)
		if (earnings) {
			renderEarningsTable(earnings)
			updateFromEarnings(earnings)
			tableIsDirty = false
			return true
		}
		if (earningsTableBody) {
			earningsTableBody.textContent = ""
		}
		setReportsVisibility(false)
		return false
	}

	xmlUpload?.addEventListener("change", () => {
		const file = xmlUpload.files?.[0]
		if (!file) {
			return
		}
		const reader = new FileReader()
		reader.onload = () => {
			lastXmlText = String(reader.result || "")
			handleXmlText(lastXmlText, true)
			const birthDate = parseDateOfBirthFromXml(lastXmlText)
			if (birthDate && currentAgeSelect) {
				const age = getAgeFromDate(birthDate)
				const option = currentAgeSelect.querySelector(`option[value='${age}']`)
				if (option) {
					currentAgeSelect.value = String(age)
				}
			}
			activateTab("earnings")
		}
		reader.onerror = () => {
			setStatus("Failed to read the XML file.", true)
		}
		reader.readAsText(file)
	})

	estimateCalculateButton?.addEventListener("click", () => {
		const earnings = buildEstimatedEarnings({
			startYear: firstYearWorkingSelect?.value ?? "",
			endYear: Number.parseInt(lastYearWorkingSelect?.value ?? "", 10),
			currentIncome: parseNumberInput(currentIncomeInput?.value ?? ""),
			raisePct: Number.parseFloat(annualRaisesInput?.value ?? ""),
		})
		if (!earnings) {
			setStatus("Enter a valid current income and start year to estimate earnings.", true)
			return
		}
		renderEarningsTable(earnings)
		updateFromEarnings(earnings)
		tableIsDirty = false
		setStatus("Estimated earnings were generated.")
	})

	const refreshProjection = () => {
		const earnings = readEarningsTable()
		if (earnings.length) {
			updateFromEarnings(earnings)
		}
	}

	currentAgeSelect?.addEventListener("change", refreshProjection)
	lifeExpectancySelect?.addEventListener("change", refreshProjection)
	futureReturnsSelect?.addEventListener("change", refreshProjection)
	npvDiscountSelect?.addEventListener("change", refreshProjection)
	benefitColaSelect?.addEventListener("change", refreshProjection)
	retireAgeSelect?.addEventListener("change", refreshProjection)
	opportunityRangeSelect?.addEventListener("change", refreshProjection)

	// Also listen for any changes inside the assumptions tab (covers selects/inputs added later)
	const assumptionsPanel = document.getElementById("tab-assumptions")
	assumptionsPanel?.addEventListener("change", refreshProjection)
	assumptionsPanel?.addEventListener("input", refreshProjection)

	earningsTableBody?.addEventListener("input", (event) => {
		if (!(event.target instanceof HTMLInputElement)) {
			return
		}
		if (event.target.dataset.field === "grossIncome" || event.target.dataset.field === "year") {
			const row = event.target.closest("tr")
			if (row) {
				const yearValue = row.querySelector("[data-field='year']")?.value ?? ""
				const grossValue = row.querySelector("[data-field='grossIncome']")?.value ?? ""
				const year = Number.parseInt(yearValue, 10)
				const grossParsed = parseNumberInput(grossValue)
				const computed = getTaxableEarningsFromGross(year, grossParsed)
				const ssInput = row.querySelector("[data-field='ssEarnings']")
				const medicareInput = row.querySelector("[data-field='medicareEarnings']")
				if (ssInput instanceof HTMLInputElement) {
					ssInput.value = Number.isFinite(computed.ssEarnings)
						? formatNumber(computed.ssEarnings)
						: ""
				}
				if (medicareInput instanceof HTMLInputElement) {
					medicareInput.value = Number.isFinite(computed.medicareEarnings)
						? formatNumber(computed.medicareEarnings)
						: ""
				}
			}
		}
		const row = event.target.closest("tr")
		if (row) {
			updateRowTaxes(row)
		}
		tableIsDirty = true
		const earnings = readEarningsTable()
		setReportsVisibility(earnings.length > 0)
		updateFromEarnings(earnings)
	})
}
	// UI bootstrap (populated from index.html)
	myss.init = initUI;

	/**
	 * Calculate AIME (Average Indexed Monthly Earnings) from an earnings array.
	 *
	 * Inputs: `earnings` is an array of objects with a numeric `ssEarnings` field and a `year`.
	 * This function uses the standard 35-year rule by default (top 35 years),
	 * summing the highest `numYears` of `ssEarnings`, then dividing by `numYears * 12`.
	 * If there are fewer than `numYears` entries, missing years are treated as 0.
	 *
	 * Returns an object: { aime, sumTopYears, yearsUsed, divisorMonths }
	 */
	function calculateAime(earnings, { numYears = 35, useWageIndex = false, birthYear = null } = {}) {
		if (!Array.isArray(earnings)) {
			return { aime: null, sumTopYears: null, yearsUsed: 0, divisorMonths: numYears * 12 }
		}
		// Extract earnings per year
		const records = earnings.map((r) => ({ year: r.year, val: Number.isFinite(Number(r && (r.ssEarnings ?? r.ss ?? r.fica ?? 0))) ? Number(r && (r.ssEarnings ?? r.ss ?? r.fica ?? 0)) : 0 }))

		let processed = records.slice()
		if (useWageIndex) {
			// determine indexing year: birthYear + 60
			const currentYear = new Date().getFullYear()
			let idxYear = null
			if (Number.isFinite(birthYear)) {
				idxYear = Number(birthYear) + 60
			} else {
				// fall back to using current year
				idxYear = currentYear
			}
			// If AWI table available, apply indexing for years < idxYear
			const awi = myss._ssa?.awi ?? {}
			const awiIdx = awi[idxYear]
			processed = processed.map((rec) => {
				const y = rec.year
				const raw = rec.val
				if (!Number.isFinite(raw)) return { year: y, val: 0 }
				if (!Number.isFinite(awiIdx) || !Number.isFinite(awi[y]) || y >= idxYear) {
					return { year: y, val: raw }
				}
				const factor = awiIdx / awi[y]
				const indexed = Math.round(raw * factor)
				return { year: y, val: indexed }
			})
		}

		const numbers = processed.map((r) => r.val)

		// Sort descending and take the top numYears
		const top = numbers.slice().sort((a, b) => b - a).slice(0, numYears)
		const sumTopYears = top.reduce((s, v) => s + v, 0)
		const divisorMonths = numYears * 12
		const aime = Math.floor(sumTopYears / divisorMonths)
		return { aime, sumTopYears, yearsUsed: top.length, divisorMonths }
	}

	// expose to public API
	myss.calculateAime = calculateAime;

/**
 * Calculate PIA (Primary Insurance Amount) from AIME.
 * Accepts either a numeric `aime` or an earnings array (then AIME is derived).
 * Options: { year, bendPoints } where bendPoints is [b1, b2] in dollars.
 * Returns { pia, components: { p1, p2, p3 }, bendPoints }
 */
function calculatePia(input, { year = new Date().getFullYear(), bendPoints = null } = {}) {
	let aime = null
	if (Array.isArray(input)) {
		const r = calculateAime(input)
		aime = r && Number.isFinite(r.aime) ? r.aime : null
	} else {
		aime = Number(input)
	}
	if (!Number.isFinite(aime)) {
		return { pia: null, components: null, bendPoints: null }
	}

	const defaults = {
		2023: [1115, 6721],
		2024: [1115, 6721],
		2025: [1115, 6721],
	}
	const bp = Array.isArray(bendPoints) && bendPoints.length >= 2 ? bendPoints : (defaults[year] || defaults[2023])
	const b1 = Number(bp[0])
	const b2 = Number(bp[1])
	const p1 = Math.min(aime, b1)
	const p2 = Math.min(Math.max(aime - b1, 0), Math.max(b2 - b1, 0))
	const p3 = Math.max(aime - b2, 0)
	const pia = Math.round(0.9 * p1 + 0.32 * p2 + 0.15 * p3)
	return { pia, components: { p1, p2, p3 }, bendPoints: [b1, b2] }
}

myss.calculatePia = calculatePia;

/**
 * Calculate monthly benefit based on PIA and claimed retirement age.
 * Parameters: object with keys { pia, retireAge, fullRetirementAge }
 * - `pia`: numeric monthly PIA
 * - `retireAge`: claimed age (years, may be fractional)
 * - `fullRetirementAge`: the FRA (years, default 67)
 *
 * Returns: { monthly, monthsDiff, changePercent, factor, reason }
 */
function calculateMonthlyBenefit({ pia, retireAge, fullRetirementAge = 67 } = {}) {
	const piaVal = Number(pia)
	const claimAge = Number(retireAge)
	const fra = Number(fullRetirementAge)
	if (!Number.isFinite(piaVal) || !Number.isFinite(claimAge) || !Number.isFinite(fra)) {
		return { monthly: null, monthsDiff: null, changePercent: null, factor: null, reason: 'invalid input' }
	}

	// Cap delayed retirement credits at age 70 (no additional credits after 70)
	const MAX_CLAIM_AGE = 70
	const effectiveClaimAge = Math.min(claimAge, MAX_CLAIM_AGE)
	const monthsDiff = Math.round((effectiveClaimAge - fra) * 12)
	// No change at FRA
	if (monthsDiff === 0) {
		return { monthly: Math.round(piaVal), monthsDiff: 0, changePercent: 0, factor: 1, reason: 'fra' }
	}

	if (monthsDiff < 0) {
		// Early claiming: reductions
		const earlyMonths = -monthsDiff
		const first36 = Math.min(earlyMonths, 36)
		const after36 = Math.max(0, earlyMonths - 36)
		// Reduction rates: 5/9 of 1% per month for first 36 months, then 5/12 of 1% per month thereafter
		const reductionPercent = first36 * (5 / 9) + after36 * (5 / 12)
		const factor = 1 - reductionPercent / 100
		const monthly = Math.round(piaVal * factor)
		return { monthly, monthsDiff, changePercent: -reductionPercent, factor, reason: 'early' }
	}

	// Delayed retirement credits: typically 2/3% per month (8% per year)
	const delayedMonths = monthsDiff
	const increasePercent = delayedMonths * (2 / 3)
	const factor = 1 + increasePercent / 100
	const monthly = Math.round(piaVal * factor)
	const reason = claimAge > MAX_CLAIM_AGE ? 'delayed-capped' : 'delayed'
	return { monthly, monthsDiff, changePercent: increasePercent, factor, reason }
}

myss.calculateMonthlyBenefit = calculateMonthlyBenefit;

if (typeof module !== "undefined" && module.exports) {
	module.exports = myss
} else if (typeof window !== "undefined") {
	window.myss = myss
}
