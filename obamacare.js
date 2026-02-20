// Defines an array of Obamacare surtax threshold records by year.

"use strict"

const obamacareThresholds = [
	{
		year: 2013,
		singleThreshold: 200000,
		jointThreshold: 250000,
		ratePct: 0.9,
	},
	{
		year: 2014,
		singleThreshold: 200000,
		jointThreshold: 250000,
		ratePct: 0.9,
	},
	{
		year: 2015,
		singleThreshold: 200000,
		jointThreshold: 250000,
		ratePct: 0.9,
	},
	{
		year: 2016,
		singleThreshold: 200000,
		jointThreshold: 250000,
		ratePct: 0.9,
	},
	{
		year: 2017,
		singleThreshold: 200000,
		jointThreshold: 250000,
		ratePct: 0.9,
	},
	{
		year: 2018,
		singleThreshold: 200000,
		jointThreshold: 250000,
		ratePct: 0.9,
	},
	{
		year: 2019,
		singleThreshold: 200000,
		jointThreshold: 250000,
		ratePct: 0.9,
	},
	{
		year: 2020,
		singleThreshold: 200000,
		jointThreshold: 250000,
		ratePct: 0.9,
	},
	{
		year: 2021,
		singleThreshold: 200000,
		jointThreshold: 250000,
		ratePct: 0.9,
	},
	{
		year: 2022,
		singleThreshold: 200000,
		jointThreshold: 250000,
		ratePct: 0.9,
	},
	{
		year: 2023,
		singleThreshold: 200000,
		jointThreshold: 250000,
		ratePct: 0.9,
	},
	{
		year: 2024,
		singleThreshold: 200000,
		jointThreshold: 250000,
		ratePct: 0.9,
	},
	{
		year: 2025,
		singleThreshold: 200000,
		jointThreshold: 250000,
		ratePct: 0.9,
	},
	{
		year: 2026,
		singleThreshold: 200000,
		jointThreshold: 250000,
		ratePct: 0.9,
	},
]

const obamacareByYear = new Map(obamacareThresholds.map((entry) => [entry.year, entry]))

module.exports = { obamacareThresholds, obamacareByYear }
