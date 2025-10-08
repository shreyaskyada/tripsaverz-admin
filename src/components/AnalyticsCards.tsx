"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui-components/card";
import { MapPin, TrendingUp, Users } from "lucide-react";

interface PopularSearch {
  route: string;
  count: number;
}

interface TopProvider {
  provider: string;
  count: number;
}

interface PopularSearchesProps {
  searches: PopularSearch[];
}

interface TopProvidersProps {
  providers: TopProvider[];
}

export function PopularSearches({ searches }: PopularSearchesProps) {
  return (
    <Card className="border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <MapPin className="h-5 w-5 text-blue-600" />
          Top 5 Popular Searches
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {searches.length > 0 ? (
            searches.map((search, index) => (
              <div
                key={search.route}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">
                    {search.route}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    {search.count}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No search data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function TopProviders({ providers }: TopProvidersProps) {
  return (
    <Card className="border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Users className="h-5 w-5 text-green-600" />
          Top 5 Clicked Providers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {providers.length > 0 ? (
            providers.map((provider, index) => (
              <div
                key={provider.provider}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm font-semibold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">
                    {provider.provider}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    {provider.count}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No provider data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
