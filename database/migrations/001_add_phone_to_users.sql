-- Migration: Add phone column to users table
-- Run this after initial schema

ALTER TABLE users ADD COLUMN phone VARCHAR(20);